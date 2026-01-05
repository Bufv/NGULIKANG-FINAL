const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Start or Get Admin Chat (Support Chat)
exports.startAdminChat = async (req, res) => {
    try {
        const userId = req.user.id;

        // Check if support chat exists
        let chatRoom = await prisma.chatRoom.findFirst({
            where: {
                userId: userId,
                type: 'ADMIN'
            }
        });

        if (!chatRoom) {
            chatRoom = await prisma.chatRoom.create({
                data: {
                    userId,
                    type: 'ADMIN'
                }
            });
        }

        res.json(chatRoom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error starting chat' });
    }
};

// Get Rooms List
exports.getChatRooms = async (req, res) => {
    try {
        const userId = req.user.id;
        const { role } = req.user;

        let whereClause = {};
        if (role === 'admin') {
            // Admin sees all support chats
            whereClause = { type: 'ADMIN' };
        } else if (role === 'tukang') {
            whereClause = { tukangId: req.user.id };
        } else {
            // User sees their own chats
            whereClause = { userId };
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
                // sort by last message time if possible, otherwise createdAt
                createdAt: 'desc'
            }
        });

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
