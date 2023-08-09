import express from "express";

import { login, signUp } from "../controllers/authController";

const router = express.Router();

router.route("/login").post(login);

router.route("/signup").post(signUp);

export const authRouter = router;
