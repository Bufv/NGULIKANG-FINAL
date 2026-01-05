const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const {
  listUsers,
  listTukang,
  createUser,
  updateUser,
  deleteUser,
  verifyTukang
} = require('../controllers/adminController');
const {
  listAdminProducts,
  getAdminProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
} = require('../controllers/productController');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/users', listUsers);
router.get('/tukang', listTukang);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/tukang/:id/verify', verifyTukang);

router.get('/products', listAdminProducts);
router.get('/products/:id', getAdminProduct);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/products/:id/upload', upload.single('file'), uploadProductImage);

module.exports = router;
