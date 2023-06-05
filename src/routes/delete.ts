import express from "express";
const router = express.Router();
import { deleteClassification } from '../controllers/classificationsController';

router
  .route('/delete')
  .post(deleteClassification);

export const deleteRoute = router;