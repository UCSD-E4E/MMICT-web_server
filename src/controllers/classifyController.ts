import { Request, Response } from 'express';
import { Image } from '../models/Image';
import { io } from "socket.io-client";

export const classify = async (req: Request, res: Response) => {
    try {

        const socket = io('ws://127.0.0.1:5001/ws-process');

        const dataType = req.body.dataType
        const modelType = req.body.modelType

        const requestJson = {
            classifier_id: 0,
            processor_id: 0,
            image_ref: 'dummy-img-ref',
        };

        console.log("classify");
        socket.emit('classify-parameters', JSON.stringify(requestJson));

        socket.on('message', (data: string) => {
          const result = JSON.parse(data);
          console.log(`Received message: ${result}`);
        });

        socket.on('error', (data: string) => {
          const result = JSON.parse(data);
          console.log(`Received error: ${result}`);
        });

        // res.status(200).send("classify completed!");

    } catch (err) {
        res.status(500).json(err);
    }
}