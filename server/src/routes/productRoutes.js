const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getStockLog,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// GET /api/products  (public)
router.get('/', getProducts);

// GET /api/products/:id  (public)
router.get('/:id', getProductById);

// POST /api/products  (admin only)
router.post('/', protect, requireRole('admin'), createProduct);

// PUT /api/products/:id  (admin only)
router.put('/:id', protect, requireRole('admin'), updateProduct);

// DELETE /api/products/:id  (admin only — soft delete)
router.delete('/:id', protect, requireRole('admin'), deleteProduct);

// PATCH /api/products/:id/stock  (receptionist, admin)
router.patch('/:id/stock', protect, requireRole('receptionist', 'admin'), updateStock);

// GET /api/products/:id/stock-log  (receptionist, admin)
router.get('/:id/stock-log', protect, requireRole('receptionist', 'admin'), getStockLog);

module.exports = router;
