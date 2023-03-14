const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

router
  .route('/upload')
  .put(uploadController.uploadToS3);

module.exports = router;