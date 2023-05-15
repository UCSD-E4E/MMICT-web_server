import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Image } from '../models/Image';

export const deleteClassification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("delete classification")


        res.status(200).json();
    } catch (err) {
        next(err)
    }
}