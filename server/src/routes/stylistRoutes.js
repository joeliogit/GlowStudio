const express = require('express');
const router = express.Router();
const {
  getStylists,
  getStylistById,
  createStylist,
  updateStylist,
} = require('../controllers/stylistController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// GET /api/stylists  (public)
router.get('/', getStylists);

// GET /api/stylists/:id  (public)
router.get('/:id', getStylistById);

// POST /api/stylists  (admin)
router.post('/', protect, requireRole('admin'), createStylist);

// PUT /api/stylists/:id  (admin)
router.put('/:id', protect, requireRole('admin'), updateStylist);

module.exports = router;
