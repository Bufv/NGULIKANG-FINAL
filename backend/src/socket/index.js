const socketIo = require('socket.io');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const initSocket = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Join a chat room
        socket.on('join_room', (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        });

        // Send a message
        socket.on('send_message', async (data) => {
            // data: { roomId, senderId, content }
            const { roomId, senderId, content } = data;

            if (!roomId || !senderId || !content) return;

            try {
                // Save to DB
                const message = await prisma.message.create({
                    data: {
                        roomId,
                        senderId,
                        content,
                        read: false
                    },
                    include: {
                        sender: {
                            select: { id: true, name: true, avatar: true, role: true }
                        }
                    }
                });

                // Broadcast to room
                io.to(roomId).emit('receive_message', message);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
};

module.exports = initSocket;
