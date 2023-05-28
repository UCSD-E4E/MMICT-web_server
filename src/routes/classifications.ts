import express from "express";
const router = express.Router();
import { deleteClassification, getClassifications } from '../controllers/classificationsController';

router
  .route('/delete')
  .delete(deleteClassification);

router
  .route('/')
  .delete(getClassifications);

export const classificationsRoute = router;