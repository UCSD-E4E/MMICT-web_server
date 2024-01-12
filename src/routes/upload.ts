import express from "express";
import { uploadToS3 } from '../controllers/uploadController';
const upload = require('multer')();

const router = express.Router();

router
  .route('/upload')
  .post(upload.any(), uploadToS3);

export const uploadRoute = router;