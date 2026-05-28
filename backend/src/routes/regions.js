const express = require('express');
const router = express.Router();
const { getRegions, getRegionBySlug, getAllRegionsAdmin, updateRegion } = require('../controllers/regionController');
const { protect } = require('../middleware/auth');

router.get('/', getRegions);
router.get('/admin/all', protect, getAllRegionsAdmin);
router.get('/:slug', getRegionBySlug);
router.put('/:id', protect, updateRegion);

module.exports = router;
