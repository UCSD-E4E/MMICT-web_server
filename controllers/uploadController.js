require('dotenv/config')
const AWS = require('aws-sdk')
const uuid = require('uuid').v4;
const User = require('../models/User');
const Image = require('../models/Image');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3({
    region: process.env.AWS_REGION
});

const uploadToS3 = async (req, res, next) => {
    try {
        const { username } = req.body;

        const files = req.files;

        files.forEach(async file => {
            const fileKey = uuid();
            let fileName = file.originalname.split(".");
            const fileType = fileName[fileName.length - 1];

            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${fileKey}.${fileType}`,
                Body: file.buffer
            };

            s3.upload(params, (error, data) => {
                if(error) {
                    throw error;
                }
            });

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

module.exports = {
    uploadToS3
}
