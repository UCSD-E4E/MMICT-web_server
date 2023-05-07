import { Request, Response } from 'express';
import { Image } from '../models/Image';
import { WebSocket } from 'ws'

export const classify = async (req: Request, res: Response) => {
    try {

      console.log(`classification request: ${req.body.dataType}, ${req.body.modelType}`);

      const WEBSERVER:string = "http://localhost:8000";
      const PROCESSING_SERVICE_IP:string = 'ws://host.docker.internal:5001/ws-classify';

      const ws:WebSocket = new WebSocket(PROCESSING_SERVICE_IP, {
        origin: WEBSERVER,
      })

      const requestJson = {
        data_type: req.body.dataType,
        processor_id: req.body.modelType,
        //todo: retrieve image reference from user db
        image_ref: 'dummy-img-ref',
      };

      ws.on('error', (e:any) => console.log(e));

      ws.on('open', function open() {
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