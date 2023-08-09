import express from "express";

import { requireAuth } from "../middlewares/auth";
import { getUsers } from "../controllers/userController";

const router = express.Router();

router.route("/").get(getUsers);

export const userRouter = router;
