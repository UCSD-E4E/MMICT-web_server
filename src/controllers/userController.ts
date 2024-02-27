import { Request, Response } from 'express';
import { User } from '../models/User';

// get a user's information from the mongoDB database by their userId
export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({userId : req.params.userId});
    
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

// legacy code. It seems to get all users for some reason
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({});
    
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
}

// upload a user's information to the mongoDB database when they first sign up
export const uploadUser = async (req: Request, res: Response) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

// check that a user doesn't alreay exist by the userId
export const checkUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (user) {
          res.json({ exists: true });
        } else {
          res.json({ exists: false });
        }
    } catch (error) {
    res.status(500).send(error);
    }
}
