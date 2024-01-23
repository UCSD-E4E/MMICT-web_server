import express from "express";
const router = express.Router();
import { login, signUp } from '../controllers/authController';

router
  .route('/login')
  .post(login);

router
  .route('/signup')
  .post(signUp);

export const authRouter = router;