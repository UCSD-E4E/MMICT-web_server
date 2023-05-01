import express from "express";
const router = express.Router();
import { classify } from '../controllers/classifyController';

router
  .route('/classify')
  .post(classify);

export const classifyRouter = router;