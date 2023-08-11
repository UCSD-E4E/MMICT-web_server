import express from "express";
import { Request, Response, NextFunction } from 'express';
const router = express.Router();
import { uploadToS3 } from '../controllers/uploadController';
const upload = require('multer')();

router
  .route('/upload')
  .post(upload.any(), uploadToS3);


router
  .route('/hello-world')
  .get((req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('hello world!');
  });

export const uploadRoute = router;