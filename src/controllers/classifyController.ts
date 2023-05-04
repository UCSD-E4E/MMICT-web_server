import { Request, Response } from 'express';
import { Image } from '../models/Image';
import { io } from "socket.io-client";
import { WebSocket } from 'ws'

export const classify = async (req: Request, res: Response) => {
    try {

      const PROCESSING_SERVICE_IP:string = 'ws://100.64.214.98:5000/ws-process';
      // const ECHO:string = 'ws://100.64.211.153:5001/echo'

      const ws:WebSocket = new WebSocket(PROCESSING_SERVICE_IP)
      // res.setHeader("Content-type=")
      const requestJson = {
        classifier_id: 0,
        processor_id: 0,
        image_ref: 'dummy-img-ref',
    };


      ws.on('error', (e:any) => console.log(e));

      ws.on('open', function open() {
        console.log("ws connection opened")
        ws.send(JSON.stringify(requestJson));
        console.log("sent %s", JSON.stringify(requestJson))
      });
      

      ws.on('message', (data:any) => ws_callback(data));
    

      function ws_callback(data:any){
        console.log('msg: %s', data);
        data = JSON.parse(String(data))
        let data_status = data["status"]
        console.log('status: %s', data_status)
        if(data_status == 'DONE'){
          if(!("geojson" in data)){
            res.status(500)
            res.statusMessage = "Geojson Not Returned"
            res.send()
          }
          res.status(269)
          res.statusMessage = "Groovy"
          res.send(data["geojson"])
        }
      }
      
      // function message_callback(data:any){}


    } catch (err) {
        res.status(200).send(err);
        console.log(err)
    }
}