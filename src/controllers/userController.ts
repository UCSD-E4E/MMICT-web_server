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

//get images based on userid
export const getImages = async (req: Request, res: Response) => {
    try {
        const pipeline = [
            // filter so we only use data that fits our userId
            { $match: { userId: req.params.userId } },
            // lookup all images with the same id as the images in the user
            { $lookup: {
                from: "images",
                localField: "images",
                foreignField: "_id",
                as: "imageDetails"
              }
            },
            // add the images to an array we will return
            { $project: {
                userId: 1,
                imageDetails: 1
              }
            }
        ];
        console.log("pipeline: ", pipeline);
        const result = await User.aggregate(pipeline);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
}

//get classifications based on userId
export const getClassifications = async (req: Request, res: Response) => {
    try {
        console.log("userId: ", req.params.userId);
        const pipeline = [
            // filter so we only use data that fits our userId
            { $match: { userId: req.params.userId } },
            // lookup all Classifications with the same id as the images in the user
            { $lookup: {
                from: "classifications",  
                localField: "classifications", 
                foreignField: "_id", 
                as: "classificationDetails"
                }
            },
            // add the classifications to an array we will return
            { $project: {
                userId: 1,
                classificationData: "$classificationDetails.data" 
              }
            }
        ];
        console.log("pipeline: ", pipeline);
        const result = await User.aggregate(pipeline);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
}