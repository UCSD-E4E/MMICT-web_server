import { Request, Response } from 'express';
import { Image } from '../models/Image';

export const getImages = async (req: Request, res: Response) => {
    try {
        const images = await Image.find({});
    
        res.status(200).json(images);
    } catch (err) {
        res.status(500).json(err);
    }
}