import { Request, Response } from 'express';
import { Image } from '../models/Image';
import { io } from "socket.io-client";
import { WebSocket } from 'ws'

export const classify = async (req: Request, res: Response) => {
    try {
      // command to run on commandline \/ \/ \/ 
      // curl -X POST -H "Content-Type: application/json" -d '{"classifier_id": 0, "processor_id": 0, "image_ref":"test_ref"}' 127.0.0.1:8000/classify

      // CHANGE IP TO THIS MACHINE'S IP !!
      const PROCESSING_SERVICE_IP:string = 'ws://100.64.220.102:5000/ws-process';
      const ws:WebSocket = new WebSocket(PROCESSING_SERVICE_IP)

      console.log(req.body)
      // Return a 400 error if anything is missing from the request body
      if (!("classifier_id" in req.body && "processor_id" in req.body && "image_ref" in req.body)){
        res.status(400)
        res.statusMessage = "Missing Requirements"
        res.send()
        return
      }

      // fill in the request
      let requestJson = {
        classifier_id: req.body['classifier_id'],
        processor_id: req.body['processor_id'],
        image_ref: req.body['image_ref']
      };

      ws.on('error', (e:any) => console.log(e));
      ws.on('message', (data:any) => ws_callback(data));

      // send request to ip_service
      ws.on('open', function open() {
        console.log("ws connection opened")
        ws.send(JSON.stringify(requestJson));
        console.log("sent %s", JSON.stringify(requestJson))
      });
          
      // callback function for recieving all incoming websocket communication
      function ws_callback(data:any){
        console.log('msg: %s', data);
        // read incoming communication as a JSON object
        data = JSON.parse(String(data))
        let data_status = data["status"]
        console.log('status: %s', data_status)
        // if classification is done, return geojson to the client if geojson exists
        if(data_status == 'DONE'){
          if(!("geojson" in data)){
            res.status(500)
            res.statusMessage = "Geojson Not Returned"
            res.send()
          }
          res.status(269)
          res.statusMessage = "Groovy"
          res.send(data)
        }
      }
      


    } catch (err) {
        res.status(500).send(err);
        console.log(err)
    }
}