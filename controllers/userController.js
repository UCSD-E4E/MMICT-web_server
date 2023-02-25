const User = require('../models/User');

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
    
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    getUsers
}