import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Image } from '../models/Image';
import { NotFound } from '../error';

export const getClassifications = async (req: Request, res: Response, next: NextFunction) => {
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

export const deleteClassification = async (req: Request, res: Response, next: NextFunction) => {

    const { username, id } = req.body;

    try {
        console.log("delete classification")

        // delete from user
        await User.findOneAndUpdate(
            { 
                username: username 
            }, 
            { 
                $pull: {
                    images: { _id: id }
                } 
            }
        );

        // delete from image collection
        await Image.findOneAndDelete(
            { 
                _id: id 
            }
        );

        res.status(200).json({success: "Deletion successful!"});
    } catch (err) {
        next(err)
    }
}