import { Request, Response } from 'express';
import { User } from '../models/User';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({}).select("-password");
    
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
}