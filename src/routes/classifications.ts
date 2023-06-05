import express from "express";
const router = express.Router();
import { deleteClassification, getClassifications, downloadClassification } from '../controllers/classificationsController';

router
  .route('/download')
  .get(downloadClassification);

router
  .route('/delete')
  .delete(deleteClassification);

router
  .route('/')
  .get(getClassifications);

export const classificationsRoute = router;