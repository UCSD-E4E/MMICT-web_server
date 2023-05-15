import express from "express";
const router = express.Router();
import { uploadToS3 } from '../controllers/uploadController';
const upload = require('multer')();

router
  .route('/upload')
  .post(upload.any(), uploadToS3);

export const uploadRoute = router;