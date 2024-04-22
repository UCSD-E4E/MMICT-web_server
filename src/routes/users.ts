import express from "express";
import { getUsers, uploadUser, getUser, checkUser } from '../controllers/userController';

const router = express.Router();

router
  .route('/')
  .get(getUsers);

router
  .route('/checkUser/:userId')
  .get(checkUser);

router
  .route('/upload')
  .post(uploadUser);

router
  .route('/getUser/:userId')
  .get(getUser);


export const userRouter = router;