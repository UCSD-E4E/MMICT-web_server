const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('multer')();

router
  .route('/upload')
  .post(upload.any(), uploadController.uploadToS3);

module.exports = router;