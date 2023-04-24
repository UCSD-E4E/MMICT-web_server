import { Request, Response } from 'express';
import { Image } from '../models/Image';
import io from 'socket.io-client';

const socket = io('ws://localhost:5000/ws-process');

const classify = async (req: Request, res: Response) => {
    try {
        const requestJson = {
            classifier_id: 0,
            processor_id: 0,
            image_ref: 'dummy-img-ref',
        };
        socket.emit('classify-parameters', JSON.stringify(requestJson));
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    classify
}