import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Image } from '../models/Image';

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