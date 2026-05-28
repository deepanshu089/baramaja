const express = require('express');
const router = express.Router();
const { getConfig, updateConfig, updateConfigBulk } = require('../controllers/configController');
const { protect } = require('../middleware/auth');

router.get('/', getConfig);                       // public
router.put('/', protect, updateConfig);           // admin — single key
router.put('/bulk', protect, updateConfigBulk);  // admin — multiple keys

module.exports = router;
