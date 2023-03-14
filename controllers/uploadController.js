const uploadToS3 = async (req, res) => {
    try {
        console.log("upload request received");

        //todo: upload image to S3

        res.status(200).send('Image uploaded to S3 successfully!');
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    uploadToS3
}
