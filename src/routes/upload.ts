import express from "express";

import { uploadToS3 } from "../controllers/uploadController";

const router = express.Router();
const upload = require("multer")();

router.route("/upload").post(upload.any(), uploadToS3);

export const uploadRoute = router;
