const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = (io) => {
    io.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.query.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        try {
            const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;
            const payload = jwt.verify(tokenString, env.jwtSecret);
            console.log('[Socket Auth] Payload:', JSON.stringify(payload)); // DEBUG LOG
            socket.user = { id: payload.sub, role: payload.role };
            next();
        } catch (err) {
            console.error('[Socket Auth] Error:', err.message);
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`[Socket] User connected: ${socket.id}, UserID: ${socket.user?.id}, Role: ${socket.user?.role}`); // DEBUG LOG

        if (socket.user?.role && socket.user.role.toLowerCase() === 'admin') {
            socket.join('admin_dashboard');
            console.log(`[Socket] Admin ${socket.user.id} joined admin_dashboard`);
        }

        socket.on('join_room', (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.user.id} joined room ${roomId}`);
        });

        socket.on('leave_room', (roomId) => {
            socket.leave(roomId);
        });

        socket.on('send_message', async (data, callback) => {
            const { roomId, content } = data;
            const senderId = socket.user.id;

            try {
                const message = await prisma.message.create({
                    data: {
                        roomId,
                        senderId,
                        content,
                    },
                    include: {
                        sender: {
                            select: { id: true, name: true, avatar: true, role: true }
                        }
                    }
                });

                // Get Room Type
                const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });

                io.to(roomId).emit('receive_message', message);

                // If this is an ADMIN chat, also broadcast to all admins
                if (room && room.type === 'ADMIN') {
                    io.to('admin_dashboard').emit('receive_message', message);
                }

                await prisma.chatRoom.update({
                    where: { id: roomId },
                    data: { updatedAt: new Date() }
                });

                if (typeof callback === 'function') {
                    callback({ status: 'ok', message });
                }

            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', 'Failed to send message');
                if (typeof callback === 'function') {
                    callback({ status: 'error', error: 'Failed to send message' });
                }
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.user.id);
        });
    });
};
