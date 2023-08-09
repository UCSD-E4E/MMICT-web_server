// Need values from env variables
/* eslint-disable no-process-env */

import { type Request, type Response, type NextFunction } from "express";

import { User } from "../models/User";
import { Image } from "../models/Image";

const AWS = require("aws-sdk");
const uuid = require("uuid").v4;

require("dotenv").config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
});

export const uploadToS3 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username } = req.body;

    const files = req.files;

    files.forEach(async (file: any) => {
      const fileKey = uuid();
      const fileName = file.originalname.split(".");
      const fileType = fileName[fileName.length - 1];

      const params: any = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${fileKey}.${fileType}`,
        Body: file.buffer,
      };

      s3.upload(params, (error: Error, data: any) => {
        if (error) {
          throw error;
        }
      });

      const image = await Image.create({
        name: fileName[0],
        reference: params.Key,
        labels: null,
      });

      await User.findOneAndUpdate(
        { username },
        { $push: { images: image } },
        { new: true },
      );
    });

    res.status(200).json(await User.findOne({ username }));
  } catch (err) {
    next(err);
  }
};
