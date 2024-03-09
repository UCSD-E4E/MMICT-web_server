import express from "express";
import { requireAuth } from '../middlewares/auth';
import {uploadUser, getUser, checkUser, getImages, getClassifications } from '../controllers/userController';

const router = express.Router();

router
  .route('/checkUser/:userId')
  .get(checkUser);

router
  .route('/upload')
  .post(uploadUser);

router
  .route('/getUser/:userId')
  .get(getUser);

router
  .route('/getImages/:userId')
  .get(getImages);

router
  .route('/getClassifications/:userId')
  .get(getClassifications);

export const userRouter = router;