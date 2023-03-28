const User = require('../models/User');
const { generateToken } = require('../util/jwt');
const bcrypt = require('bcrypt');
const { BadRequest, NotFound, Unauthorized, Conflict } = require('../error/index');

const login = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username) return next(new BadRequest('Missing username'));
    if (!password) return next(new BadRequest('Missing password'));

    try {
        const user = await User.findOne({ 'username' : username });

        if(user == null) {
            return next(new NotFound('User with that username does not exist'));
        }

        const auth = await bcrypt.compare(password, user.password);

        if(!auth) {
            return next(new Unauthorized('Invalid password'));
        }

        const token = generateToken(user);

        delete user._doc.password;
    
        res.status(201).json({user, token});
    } catch (err) {
        next(err);
    }
}

const signUp = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username) return next(new BadRequest('Missing username'));
    if (!password) return next(new BadRequest('Missing password'));

    try {
        const salt = await bcrypt.genSalt();

        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username: username,
            password: hashedPassword,
            images: []
        });

        const token = generateToken(user);

        delete user._doc.password;
    
        res.status(201).json({user, token});
    } catch (err) {
        if(err.message.includes("duplicate key error collection")) {
            err = new Conflict("User with that username already exists");
        }

        next(err);
    }
}

module.exports = {
    login,
    signUp
}