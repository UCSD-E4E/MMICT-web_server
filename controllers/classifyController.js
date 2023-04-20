const Image = require('../models/Image');

const classify = async (req, res) => {
    const classified_img = [
        { id: 1, name: "classified_img.jpg" },
        { id: 2, name: "classified_img.jpg" },
        { id: 3, name: "classified_img.jpg" }
    ];
    res.status(200).send(classified_img);
}

module.exports = {
    classify
}