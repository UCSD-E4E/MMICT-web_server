import { Request, Response } from 'express';
import { Image } from '../models/Image';
import { io } from "socket.io-client";
import { WebSocket } from 'ws'

export const classify = async (req: Request, res: Response) => {
    try {

      const PROCESSING_SERVICE_IP:string = 'ws://127.0.0.1:5000/ws-classify';
      // const ECHO:string = 'ws://100.64.110.125:5001/echo'

      const ws:WebSocket = new WebSocket(PROCESSING_SERVICE_IP)

      const requestJson = {
        classifier_id: 0,
        processor_id: 0,
        image_ref: 'dummy-img-ref',
    };


      ws.on('error', (e:any) => console.log(e));

      ws.on('open', function open() {
        console.log("HUH")
        ws.send(JSON.stringify(requestJson));
        console.log("sent %s", JSON.stringify(requestJson))
      });
      
      ws.on('message', function message(data:any) {
        console.log('received: %s', data);
        res.status(269).send("kewl\n")
      });



    } catch (err) {
        res.status(200).send(err);
        console.log(err)
    }
}