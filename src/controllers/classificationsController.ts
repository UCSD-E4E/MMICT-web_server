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

export const downloadClassification = async (req: Request, res: Response, next: NextFunction) => {

    const { username, id } = req.body;
    try {

        const target_image = await Image.findOne({ _id: id });
        if (!target_image) {
            return res.status(404).json({ error: "Image not found." });
        }

        // Upload an example document with PolygonSchema to MongoDB
        // const exampleImage = new Image({
        //     name: 'Example Image',
        //     reference: 'example_reference_123',
        //     labels: {
        //         type: 'Polygon',
        //         coordinates: [
        //             [
        //                 [-122.413672, 37.785405],
        //                 [-122.409979, 37.786453],
        //                 [-122.407253, 37.782651],
        //                 [-122.413672, 37.785405]
        //             ]
        //         ]
        //     }
        // });
        // await exampleImage.save();

        const labels = target_image.labels;
        res.status(200).json(labels);

    } catch (err) {
        next(err)
    }
}
