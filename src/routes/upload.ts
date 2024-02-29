import express from "express";
const router = express.Router();
import { uploadClassification, uploadToS3 } from '../controllers/uploadController';
const upload = require('multer')();

router
  .route('/upload')
  .post(upload.any(), uploadToS3);

router
  .route('/upload/classification/:userId')
  .post(uploadClassification);

export const uploadRoute = router;