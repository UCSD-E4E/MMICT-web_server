const User = require('../models/User');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ 'username' : username });

        if(user == null) {
            res.status(401).json({ error: "User with that username does not exist"});
            return;
        }

        if(user.password !== password) {
            res.status(401).json({ error: "Invalid password"});
            return;
        }

        delete user._doc.password;
    
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

const signUp = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.create({
            username: username,
            password: password
        });

        delete user._doc.password;
    
        res.status(201).json(user);
    } catch (err) {
        if(err.message.includes("duplicate key error collection")) {
            res.status(500).json({error: "Username already taken"});
            return;
        }

        res.status(500).json(err);
    }
}

module.exports = {
    login,
    signUp
}