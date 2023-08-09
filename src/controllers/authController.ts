import { type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcrypt";

import { BadRequest, NotFound, Unauthorized, Conflict } from "../error/index";
import { generateToken } from "../util/jwt";
import { User } from "../models/User";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { username, password } = req.body;

  if (!username) {
    next(new BadRequest("Missing username"));
    return;
  }
  if (!password) {
    next(new BadRequest("Missing password"));
    return;
  }

  try {
    const user: any = await User.findOne({ username });

    if (user == null) {
      next(new NotFound("User with that username does not exist"));
      return;
    }

    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
      next(new Unauthorized("Invalid password"));
      return;
    }

    const token = generateToken(user);

    delete user._doc.password;

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { username, password } = req.body;

  if (!username) {
    next(new BadRequest("Missing username"));
    return;
  }
  if (!password) {
    next(new BadRequest("Missing password"));
    return;
  }

  try {
    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(password, salt);

    const user: any = await User.create({
      username,
      password: hashedPassword,
      images: [],
    });

    const token = generateToken(user);

    delete user._doc.password;

    res.status(201).json({ user, token });
  } catch (err: any) {
    if (err.message.includes("duplicate key error collection")) {
      err = new Conflict("User with that username already exists");
    }

    next(err);
  }
};
