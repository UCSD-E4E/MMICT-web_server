import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Image } from '../models/Image';

export const downloadGeoJson = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("download geojson");


        res.status(200).json();
    } catch (err) {
        next(err)
    }
}