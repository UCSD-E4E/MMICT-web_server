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
    S3ClientConfig,
} from "@aws-sdk/client-s3";
  
// Set up
require('dotenv').config();


// Extract AWS credentials from environment variables
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;


// Create S3 client with configured credentials and region
const s3 = new S3Client({
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
    region: region,
  } as S3ClientConfig); // Add explicit type assertion
console.log("client created");

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
            console.log("size and params done");
            // Determine what method of upload we need
            if (file.size > maxSingleFileSize) {
                await uploadLargeFile(params, file);
            }
            else {
                await uploadSmallFile(params);
            }
            console.log("Finished Upload to S3");

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



async function uploadLargeFile(params: any, file: any) {
    console.log("big file");
    const minPartSize = 10 * 1024 * 1024;
     
    //Loop to find partSize
    let numParts = 1;
    while(Math.ceil(file.size / numParts) > minPartSize) {
        ++numParts;
    }
        let uploadId;
        try {
            const multipartUpload = await s3.send(
                new CreateMultipartUploadCommand({
                    Bucket: params.Bucket,
                    Key: params.Key,
                }),
            );

            uploadId = multipartUpload.UploadId;

            const uploadPromises = [];
            // Multipart uplaods require a minimum size of 5 MB
            const partSize = Math.ceil(file.size / numParts);
            
            // Upload each part
            for (let i = 0; i < numParts; i++) {
                const start = i * partSize;
                const end = start + partSize;
                    uploadPromises.push(
                        s3.send(
                            new UploadPartCommand({
                                Bucket: params.Bucket,
                                Key: params.Key,
                                UploadId: uploadId,
                                Body: (params.Body).slice(start,end),
                                PartNumber: i + 1,
                            }),
                        )
                        .then((d) => {
                            console.log("Part", i+1, "uploaded");
                            return d;
                        }),
                   );

            }
            const uploadResults = await Promise.all(uploadPromises);

            return await s3.send(
                new CompleteMultipartUploadCommand({
                    Bucket: params.Bucket,
                    Key: params.Key,
                    UploadId: uploadId,
                    MultipartUpload: {
                        Parts: uploadResults.map(({ ETag }, i) => ({
                            ETag,
                            PartNumber: i + 1,
                        })),
                    },
                }),
            );
        } catch (err) {
            console.error(err);

            if (uploadId) {
                const abortCommand = new AbortMultipartUploadCommand ({
                    Bucket: params.Bucket,
                    Key: params.Key,
                    UploadId: uploadId,
                });

                await s3.send(abortCommand);
            }
        }
}

async function uploadSmallFile(params: any) {
        console.log("small file");
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
        
}
