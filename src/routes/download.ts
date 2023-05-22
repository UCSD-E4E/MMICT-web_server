import express from "express";
const router = express.Router();
import { downloadGeoJson } from '../controllers/downloadController';

router
  .route('/download')
  .post(downloadGeoJson);

export const downloadRoute = router;