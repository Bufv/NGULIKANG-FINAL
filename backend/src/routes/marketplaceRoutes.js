const express = require('express');
const { listPublicProducts, getPublicProduct } = require('../controllers/productController');

const router = express.Router();

router.get('/products', listPublicProducts);
router.get('/products/:id', getPublicProduct);

module.exports = router;
