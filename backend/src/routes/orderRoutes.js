const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

// Get order details with progress
router.get('/:orderId', authenticate, orderController.getOrderDetails);

// Get user's orders (for tracking page)
router.get('/', authenticate, orderController.getUserOrders);

// Process payment (dummy)
router.post('/:orderId/payment', authenticate, orderController.processPayment);

// Update progress (tukang only)
router.post('/:orderId/progress', authenticate, orderController.updateProgress);

// Get progress history
router.get('/:orderId/progress', authenticate, orderController.getProgressHistory);

module.exports = router;
