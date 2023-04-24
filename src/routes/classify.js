const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

router
  .route('/classify')
  .post(uploadController.classify);

module.exports = router;