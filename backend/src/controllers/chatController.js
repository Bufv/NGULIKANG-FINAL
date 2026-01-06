const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Start or Get Admin Chat (Support Chat)
exports.startAdminChat = async (req, res) => {
    try {
        const userId = req.user.id;

        // Check if support chat exists and is OPEN
        let chatRoom = await prisma.chatRoom.findFirst({
            where: {
                userId: userId,
                type: 'ADMIN',
                status: 'OPEN'
            }
        });

        if (!chatRoom) {
            chatRoom = await prisma.chatRoom.create({
                data: {
                    userId,
                    type: 'ADMIN',
                    tukangId: null, // Explicitly null for admin chat
                    status: 'OPEN'
                }
            });
        }

        res.json(chatRoom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error starting chat' });
    }
};

// Close Chat
exports.closeChat = async (req, res) => {
    try {
        const { roomId } = req.params;
        const updatedRoom = await prisma.chatRoom.update({
            where: { id: roomId },
            data: { status: 'CLOSED' }
        });
        res.json(updatedRoom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error closing chat' });
    }
};

// Get Rooms List
exports.getChatRooms = async (req, res) => {
    try {
        const userId = req.user.id;
        const { role } = req.user;
        const { status } = req.query; // Get status from query params
        console.log(`[getChatRooms] User: ${userId}, Role: ${role}, Status: ${status}`);

        let whereClause = {};
        if (role === 'admin') {
            // Admin sees ONLY support chats, filtered by status if provided
            whereClause = {
                type: 'ADMIN',
                status: status ? status : 'OPEN' // Default to OPEN if no status provided
            };
        } else if (role === 'tukang') {
            // Tukang sees ONLY negotiation chats (NORMAL type) assigned to them
            whereClause = {
                tukangId: req.user.id,
                type: 'NORMAL' // Exclude ADMIN support chats
            };
        } else {
            // User sees their own chats (both normal and admin)
            whereClause = { userId };
            // User might want to see history too, but for now focusing on Admin req
        }

        const rooms = await prisma.chatRoom.findMany({
            where: whereClause,
            include: {
                user: {
                    select: { id: true, name: true, avatar: true, email: true }
                },
                tukang: {
                    select: { id: true, name: true, avatar: true }
                },
                messages: {
                    take: 1,
                    orderBy: { sentAt: 'desc' }
                },
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        console.log(`[getChatRooms] Found ${rooms.length} rooms for user ${userId} (${role})`);
        if (role === 'tukang') {
            console.log(`[getChatRooms] Tukang rooms:`, rooms.map(r => ({
                roomId: r.id,
                userName: r.user?.name,
                tukangId: r.tukangId,
                tukangName: r.tukang?.name
            })));
        }

        res.json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching rooms' });
    }
};

// Get Messages
exports.getMessages = async (req, res) => {
    try {
        const { roomId } = req.params;

        // Optional: Check if user belongs to room

        const messages = await prisma.message.findMany({
            where: { roomId },
            include: {
                sender: {
                    select: { id: true, name: true, avatar: true, role: true }
                }
            },
            orderBy: { sentAt: 'asc' }
        });

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching messages' });
    }
};
