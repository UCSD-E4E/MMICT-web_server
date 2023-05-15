import express from "express";
const router = express.Router();
import { deleteClassification } from '../controllers/deleteController';

router
  .route('/delete')
  .post(deleteClassification);

export const deleteRoute = router;