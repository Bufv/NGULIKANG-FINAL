const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// === ORDER & PROJECT TRACKER CONTROLLER ===

// 1. Get Order Details (with progress)
exports.getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;
        const role = req.user.role;

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: {
                    select: { id: true, name: true, email: true, avatar: true }
                },
                tukang: {
                    select: { id: true, name: true, avatar: true }
                },
                progressUpdates: {
                    orderBy: { updatedAt: 'desc' },
                    include: {
                        updater: {
                            select: { id: true, name: true, role: true }
                        }
                    }
                },
                transactions: {
                    orderBy: { paidAt: 'desc' }
                }
            }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order tidak ditemukan' });
        }

        // Check access: only user, tukang, or admin can view
        if (role !== 'admin' && order.userId !== userId && order.tukangId !== userId) {
            return res.status(403).json({ message: 'Tidak memiliki akses' });
        }

        res.json(order);
    } catch (error) {
        console.error('[getOrderDetails] Error:', error);
        res.status(500).json({ message: 'Gagal memuat detail order' });
    }
};

// 2. Get User's Orders (for tracking page)
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        let whereClause = {};
        if (role === 'tukang') {
            whereClause = { tukangId: userId };
        } else {
            whereClause = { userId: userId };
        }

        const orders = await prisma.order.findMany({
            where: whereClause,
            include: {
                user: {
                    select: { id: true, name: true, avatar: true }
                },
                tukang: {
                    select: { id: true, name: true, avatar: true }
                },
                progressUpdates: {
                    take: 1,
                    orderBy: { updatedAt: 'desc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(orders);
    } catch (error) {
        console.error('[getUserOrders] Error:', error);
        res.status(500).json({ message: 'Gagal memuat daftar order' });
    }
};

// 3. Process Payment (Dummy)
exports.processPayment = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { agreedPrice, paymentMethod } = req.body;
        const userId = req.user.id;

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order tidak ditemukan' });
        }

        if (order.userId !== userId) {
            return res.status(403).json({ message: 'Tidak memiliki akses' });
        }

        // Update order with agreed price and status
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                totalPrice: agreedPrice || order.totalPrice,
                status: 'in_progress'
            }
        });

        // Create transaction record
        const transaction = await prisma.transaction.create({
            data: {
                orderId,
                userId,
                amount: agreedPrice || order.totalPrice,
                paymentMethod: paymentMethod || 'Dummy Payment',
                paymentStatus: 'paid',
                paidAt: new Date()
            }
        });

        // Create initial progress update
        await prisma.orderProgress.create({
            data: {
                orderId,
                progressPercentage: 0,
                notes: 'Proyek dimulai - Pembayaran berhasil',
                updatedBy: userId
            }
        });

        console.log('[processPayment] Payment successful for order:', orderId);

        res.json({
            success: true,
            message: 'Pembayaran berhasil',
            order: updatedOrder,
            transaction
        });
    } catch (error) {
        console.error('[processPayment] Error:', error);
        res.status(500).json({ message: 'Gagal memproses pembayaran' });
    }
};

// 4. Update Project Progress (Tukang only)
exports.updateProgress = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { progressPercentage, notes, images } = req.body;
        const userId = req.user.id;
        const role = req.user.role;

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order tidak ditemukan' });
        }

        // Only tukang assigned to this order can update
        if (role !== 'tukang' || order.tukangId !== userId) {
            return res.status(403).json({ message: 'Hanya tukang yang ditugaskan yang dapat update progress' });
        }

        // Create progress update
        const progressUpdate = await prisma.orderProgress.create({
            data: {
                orderId,
                progressPercentage: progressPercentage || 0,
                notes: notes || '',
                images: images || [],
                updatedBy: userId
            },
            include: {
                updater: {
                    select: { id: true, name: true, role: true }
                }
            }
        });

        // If progress is 100%, mark order as completed
        if (progressPercentage >= 100) {
            await prisma.order.update({
                where: { id: orderId },
                data: { status: 'completed' }
            });
        }

        console.log('[updateProgress] Progress updated for order:', orderId, '- Progress:', progressPercentage + '%');

        res.json({
            success: true,
            message: 'Progress berhasil diupdate',
            progressUpdate
        });
    } catch (error) {
        console.error('[updateProgress] Error:', error);
        res.status(500).json({ message: 'Gagal update progress' });
    }
};

// 5. Get Progress History
exports.getProgressHistory = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;
        const role = req.user.role;

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order tidak ditemukan' });
        }

        // Check access
        if (role !== 'admin' && order.userId !== userId && order.tukangId !== userId) {
            return res.status(403).json({ message: 'Tidak memiliki akses' });
        }

        const progressHistory = await prisma.orderProgress.findMany({
            where: { orderId },
            include: {
                updater: {
                    select: { id: true, name: true, role: true, avatar: true }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        res.json(progressHistory);
    } catch (error) {
        console.error('[getProgressHistory] Error:', error);
        res.status(500).json({ message: 'Gagal memuat history progress' });
    }
};

module.exports = exports;
