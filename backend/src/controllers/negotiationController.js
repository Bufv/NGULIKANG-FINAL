const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// === CONTROLLER KHUSUS NEGOSIASI TUKANG ===

// 1. User Memulai Negosiasi (Dari form Nguli Borongan)
exports.startNegotiation = async (req, res) => {
    try {
        // Data dari frontend: tukangId, dan detail proyek (opsional, untuk pesan awal)
        const { tukangId, projectType, propertyType, budget, location, startDate } = req.body;
        const userId = req.user.id;

        if (!tukangId) {
            return res.status(400).json({ message: 'Tukang ID harus diisi' });
        }

        // Cek apakah sudah ada chat room antara user ini dan tukang ini yang statusnya OPEN
        let chatRoom = await prisma.chatRoom.findFirst({
            where: {
                userId: userId,
                tukangId: tukangId,
                status: 'OPEN',
                type: 'NORMAL'
            }
        });

        let order = null;

        // Jika belum ada, buat baru
        if (!chatRoom) {
            // Create Order first
            order = await prisma.order.create({
                data: {
                    userId,
                    tukangId,
                    serviceType: 'borongan',
                    status: 'pending', // Pending until payment
                    totalPrice: 0, // Will be updated after negotiation
                    location: location || '',
                    projectType: projectType || '',
                    propertyType: propertyType || '',
                    budget: budget || '',
                    startDate: startDate ? new Date(startDate) : null
                }
            });

            // Create ChatRoom linked to Order
            chatRoom = await prisma.chatRoom.create({
                data: {
                    userId,
                    tukangId,
                    type: 'NORMAL',
                    status: 'OPEN'
                }
            });

            // Link Order to ChatRoom
            await prisma.order.update({
                where: { id: order.id },
                data: { chatRoomId: chatRoom.id }
            });

            // Buat pesan pembuka otomatis dari sistem/user berisi detail proyek
            const initialMessage = `Halo, saya ingin menawar jasa borongan Anda.
Detail Proyek:
- Tipe: ${projectType}
- Properti: ${propertyType}
- Budget: ${budget}
- Lokasi: ${location}
- Estimasi Mulai: ${startDate}
            `;

            await prisma.message.create({
                data: {
                    roomId: chatRoom.id,
                    senderId: userId, // Seolah-olah user yang kirim
                    content: initialMessage,
                    type: 'TEXT'
                }
            });

            console.log('[startNegotiation] Order created:', order.id);
        } else {
            // If chatRoom exists, find linked order
            order = await prisma.order.findFirst({
                where: { chatRoomId: chatRoom.id }
            });
        }

        console.log('[startNegotiation] ChatRoom created/found:');
        console.log('  - chatRoom.id:', chatRoom.id);
        console.log('  - chatRoom.id type:', typeof chatRoom.id);
        console.log('  - order.id:', order?.id);

        const response = {
            success: true,
            message: 'Negosiasi dimulai',
            chatRoomId: chatRoom.id,
            orderId: order?.id,
            chatRoom: {
                id: chatRoom.id,
                userId: chatRoom.userId,
                tukangId: chatRoom.tukangId,
                status: chatRoom.status
            }
        };

        console.log('[startNegotiation] Sending response:', JSON.stringify(response, null, 2));

        res.json(response);

    } catch (error) {
        console.error("[startNegotiation] Error:", error);
        console.error("[startNegotiation] Error stack:", error.stack);
        res.status(500).json({ message: 'Gagal memulai negosiasi', error: error.message });
    }
};

// 2. Ambil List Chat untuk Tukang (Panel Tukang)
// Atau untuk User (Web User) melihat history chat negosiasi mereka
exports.getMyNegotiations = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        let whereClause = {};

        if (role === 'tukang') {
            // Jika yang request adalah tukang, ambil chat dimana dia sebagai tukang
            whereClause = { tukangId: userId };
        } else {
            // Jika user biasa, ambil chat dia (tapi yang tipe NORMAL/Negosiasi saja, bukan Admin)
            whereClause = { userId: userId, type: 'NORMAL' };
        }

        const rooms = await prisma.chatRoom.findMany({
            where: whereClause,
            include: {
                user: { // Info User (Klien)
                    select: { id: true, name: true, avatar: true, email: true }
                },
                tukang: { // Info Tukang
                    select: { id: true, name: true, avatar: true }
                },
                messages: {
                    take: 1,
                    orderBy: { sentAt: 'desc' }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        res.json(rooms);

    } catch (error) {
        console.error("Error getMyNegotiations:", error);
        res.status(500).json({ message: 'Gagal memuat daftar negosiasi' });
    }
};

// 3. Ambil Pesan di Room Tertentu
exports.getNegotiationMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.id;

        // Verify access rights: requester must be the User or the Assigned Tukang
        const chatRoom = await prisma.chatRoom.findUnique({
            where: { id: roomId }
        });

        if (!chatRoom) {
            return res.status(404).json({ message: 'Room chat tidak ditemukan' });
        }

        // Strict Check: Only the specific User or Selected Tukang can access
        // if (chatRoom.userId !== userId && chatRoom.tukangId !== userId) {
        //     return res.status(403).json({ message: 'Anda tidak memiliki akses ke percakapan ini.' });
        // }

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
        console.error("Error getNegotiationMessages:", error);
        res.status(500).json({ message: 'Gagal memuat pesan' });
    }
};

// 4. Kirim Pesan - SIMPLIFIED VERSION WITHOUT AUTH DEPENDENCY
exports.sendNegotiationMessage = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { content } = req.body;

        console.log('[sendNegotiationMessage] START');
        console.log('[sendNegotiationMessage] roomId:', roomId);
        console.log('[sendNegotiationMessage] content:', content);

        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Pesan tidak boleh kosong' });
        }

        // Get chatRoom to determine sender
        const chatRoom = await prisma.chatRoom.findUnique({
            where: { id: roomId },
            include: {
                user: true,
                tukang: true
            }
        });

        if (!chatRoom) {
            return res.status(404).json({ message: 'Chat room not found' });
        }

        // Determine senderId from token if available, otherwise use tukangId from room
        let senderId = chatRoom.tukangId; // Default to tukang

        // Try to get from token
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            try {
                const jwt = require('jsonwebtoken');
                const env = require('../config/env');
                const payload = jwt.verify(token, env.jwtSecret);
                senderId = payload.sub;
                console.log('[sendNegotiationMessage] Using senderId from token:', senderId);
            } catch (e) {
                console.log('[sendNegotiationMessage] Using tukangId as senderId:', senderId);
            }
        }

        // Create message
        const newMessage = await prisma.message.create({
            data: {
                roomId,
                senderId,
                content: content.trim(),
                type: 'TEXT'
            },
            include: {
                sender: {
                    select: { id: true, name: true, avatar: true, role: true }
                }
            }
        });

        // Update chatRoom
        await prisma.chatRoom.update({
            where: { id: roomId },
            data: { updatedAt: new Date() }
        });

        // Emit socket
        const io = global.io;
        if (io) {
            io.to(roomId).emit('receive_message', {
                ...newMessage,
                roomId
            });
        }

        console.log('[sendNegotiationMessage] SUCCESS');
        res.json(newMessage);

    } catch (error) {
        console.error('[sendNegotiationMessage] ERROR:', error.message);
        res.status(500).json({
            message: 'Gagal mengirim pesan',
            error: error.message
        });
    }
};

// 5. Ambil Daftar Tukang Tersedia (Untuk Dummy/Demo Data)
exports.getAvailableTukangs = async (req, res) => {
    try {
        const userId = req.user.id; // Current logged-in user

        let tukangs = await prisma.user.findMany({
            where: { role: 'tukang' },
            select: {
                id: true,
                name: true,
                avatar: true,
                tukangProfile: true
            }
        });

        // Jika tidak ada tukang, buat satu dummy untuk demo
        if (tukangs.length === 0) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('123456', 10);

            const newTukang = await prisma.user.create({
                data: {
                    name: 'Tukang Demo',
                    email: `tukang_demo_${Date.now()}@nguli.com`,
                    password: hashedPassword,
                    role: 'tukang',
                    tukangProfile: {
                        create: {
                            skills: ['Batu', 'Kayu'],
                            experience: '5 Tahun',
                            rating: 4.5
                        }
                    }
                },
                select: { id: true, name: true, avatar: true }
            });
            tukangs.push(newTukang);
        }

        // Check availability: tukang is available if:
        // 1. No chat room exists with current user, OR
        // 2. Existing chat room is CLOSED (project completed)
        const tukangsWithAvailability = await Promise.all(tukangs.map(async (tukang) => {
            const existingRoom = await prisma.chatRoom.findFirst({
                where: {
                    userId: userId,
                    tukangId: tukang.id,
                    type: 'NORMAL'
                },
                select: { status: true }
            });

            return {
                ...tukang,
                isAvailable: !existingRoom || existingRoom.status === 'CLOSED',
                chatStatus: existingRoom ? existingRoom.status : null
            };
        }));

        console.log(`[getAvailableTukangs] User ${userId} - Found ${tukangsWithAvailability.length} tukangs, ${tukangsWithAvailability.filter(t => t.isAvailable).length} available`);

        res.json(tukangsWithAvailability);
    } catch (error) {
        console.error("Error getAvailableTukangs:", error);
        res.status(500).json({ message: 'Gagal memuat data tukang' });
    }
};
