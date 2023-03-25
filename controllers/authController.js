const User = require('../models/User');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ 'username' : username });

        if(user == null) {
            res.status(401).json({ error: "User with that username does not exist"});
            return;
        }

        const auth = await bcrypt.compare(password, user.password);

        if(!auth) {
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
        const salt = await bcrypt.genSalt();

        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username: username,
            password: hashedPassword
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