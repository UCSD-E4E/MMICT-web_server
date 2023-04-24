import { Request, Response, NextFunction } from 'express';
import { BadRequest, NotFound, Unauthorized, Conflict } from '../error/index';
import { generateToken } from '../util/jwt';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if (!username) return next(new BadRequest('Missing username'));
    if (!password) return next(new BadRequest('Missing password'));

    try {
        const user: any = await User.findOne({ 'username' : username });

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

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if (!username) return next(new BadRequest('Missing username'));
    if (!password) return next(new BadRequest('Missing password'));

    try {
        const salt = await bcrypt.genSalt();

        const hashedPassword = await bcrypt.hash(password, salt);

        const user: any = await User.create({
            username: username,
            password: hashedPassword,
            images: []
        });

        const token = generateToken(user);

        delete user._doc.password;
    
        res.status(201).json({user, token});
    } catch (err: any) {
        if(err.message.includes("duplicate key error collection")) {
            err = new Conflict("User with that username already exists");
        }

        next(err);
    }
}