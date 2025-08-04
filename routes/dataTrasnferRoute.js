const express = require('express');
const router = express.Router();
const dataTranX = require('../controllers/dataTransferController')

router.post('/data-x',dataTranX)

module.exports = router;