import { Request, Response, NextFunction } from 'express';
import { NotFound } from '../error';
import { User } from '../models/User';

export const getImages = async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;

    try {
        const user = await User.findOne({usernames: username});

        if(user == null) {
            return next(new NotFound('User with that username does not exist'));
        }
    
        res.status(200).json(user.images);
    } catch (err) {
        res.status(500).json(err);
    }
}