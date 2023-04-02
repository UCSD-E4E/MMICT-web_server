require('dotenv/config')
const AWS = require('aws-sdk')
const uuid = require('uuid').v4;

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3({
    region: process.env.AWS_REGION
});

const uploadToS3 = async (req, res) => {
    try {

        console.log("upload");

        const files = req.files;

        files.forEach(file => {
            const fileKey = uuid();
            let fileName = file.originalname.split(".");
            const fileType = fileName[fileName.length - 1];

            // todo: check accepted file types

            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${fileKey}.${fileType}`,
                Body: file.buffer
            };
            s3.upload(params, (error, data) => {
            if(error) {
                throw error;
            }});

            // todo: add image ref (key) to mongoDB

        });
    } catch (err) {
        res.status(500).json(err).send();
    }
    res.status(200).send();
}

module.exports = {
    uploadToS3
}
