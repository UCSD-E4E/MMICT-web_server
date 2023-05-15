import express from "express";
import { getImages } from '../controllers/imageController';

const router = express.Router();

router
  .route('/')
  .get(getImages);

export const imageRouter = router;