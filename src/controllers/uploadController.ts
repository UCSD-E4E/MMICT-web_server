import { Request, Response, NextFunction } from 'express';
const uuid = require('uuid').v4;
import { User } from '../models/User';
import { Image } from '../models/Image';

// Imports for aws sdk
import {
    PutObjectCommand,
    CreateMultipartUploadCommand,
    UploadPartCommand,
    CompleteMultipartUploadCommand,
    AbortMultipartUploadCommand,
    S3Client,
  } from "@aws-sdk/client-s3";
  
// Set up
require('dotenv').config();

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;


const s3 = new S3Client({
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    region: process.env.AWS_REGION
});

// Obtaining file size
const maxSingleFileSize = 100 * 1024 * 1024; //100MB

export const uploadToS3 = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.body;

        const files = req.files;

        files.forEach(async (file: any) => {

            const fileKey = uuid();
            let fileName = file.originalname.split(".");
            const fileType = fileName[fileName.length - 1];

            const params: any = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${fileKey}.${fileType}`,
                Body: file.buffer
            };
            // Determine what method of upload we need
            if (file.size > maxSingleFileSize) {
                await uploadLargeFile(params, file);
            }
            else {
                await uploadSmallFile(params);
            }


            const image = await Image.create({
                name: fileName[0],
                reference: params.Key,
                labels: null
            });

            await User.findOneAndUpdate({ 'username' : username }, { $push: { images: image } }, { new: true });
        });
    
        res.status(200).json(await User.findOne({'username' : username}));
    } catch (err) {
        next(err);
    }
}


async function uploadLargeFile(params, file: any) {
    const createString = (size = file.size) => {
        return "x".repeat(size);
    };

    const main = async() => {
        //todo
    }
}

async function uploadSmallFile(params) {
    const main = async () => {
        const command = new PutObjectCommand({
          Bucket: params.Bucket,
          Key: params.Key,
          Body: params.Body,
        });
        try {
            const response = await s3.send(command);
            console.log(response);
          } catch (err) {
            console.error(err);
          }
        };
}
