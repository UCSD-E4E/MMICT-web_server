const AWS = require('aws-sdk');
import { Request, Response, NextFunction } from 'express';
const uuid = require('uuid').v4;
import { User } from '../models/User';
import { Image } from '../models/Image';

require('dotenv').config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3({
    region: process.env.AWS_REGION
});

export const uploadToS3 = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files;
        const userId = req.body.userid;

        files.forEach(async (file: any) => {
            const fileKey = uuid();
            let fileName = file.originalname.split(".");
            const fileType = fileName[fileName.length - 1];

            const params: any = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${fileKey}.${fileType}`,
                Body: file.buffer
            };

            s3.upload(params, (error: Error, data: any) => {
                if(error) {
                    throw error;
                }
            });

            const image = await Image.create({
                name: fileName[0],
                userid: userId,
                reference: params.Key,
                labels: null
            });

            await User.findOneAndUpdate({ 'userId' : userId }, { $push: { images: image } }, { new: true });
        });
    
        res.status(200).json(await User.findOne({'userId' : userId}));
    } catch (err) {
        next(err);
    }
}
