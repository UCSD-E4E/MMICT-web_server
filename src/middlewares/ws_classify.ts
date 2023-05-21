import { Request, Response } from 'express';
import { Image } from '../models/Image';
import { io } from "socket.io-client";
import { WebSocket } from 'ws'

/**
 * Handle websocket version with status updates of the classification service
 */
export const handle_classify = async (socket: WebSocket) => {
  console.log("handled_classify")
  socket.on('message', message => {
    let request = JSON.parse(message.toString())
    console.log(JSON.stringify(request))
    if (!request.classifier_id || !request.processor_id || !request.image_ref) {
        socket.send("failed")
        // socket.close()
    }
    socket.send('classifying')
    classify(request, socket);
  });
}


export const classify = async (requst: any, client_socket: WebSocket) => {
    console.log("classify")
    client_socket.on('message', message => {client_socket.send("request already made, please do not make duplicate requests")});

      // CHANGE IP TO ip_service IP !!
      const IP = '100.64.85.193'
      const PROCESSING_SERVICE_IP:string = 'ws://' + IP + ':5000/ws-process';
      const ws:WebSocket = new WebSocket(PROCESSING_SERVICE_IP)


      // fill in the request with data from POST body
      let requestJson = {
        classifier_id: requst['classifier_id'],
        processor_id: requst['processor_id'],
        image_ref: requst['image_ref']
      };
      
      // console.log any error and use the ws_callback for any message
      ws.on('error', (e:any) => console.log(e));
      ws.on('message', (data:any) => ws_callback(data));

      // send request to ip_service
      ws.on('open', function open() {
        console.log("ws connection opened")
        ws.send(JSON.stringify(requestJson));
        console.log("sent %s", JSON.stringify(requestJson))
      });
          
      // callback function for recieving all incoming websocket communication
      // forward all messages to the client ws
      function ws_callback(data:any){
        console.log('msg: %s', data);
        // read incoming communication as a JSON object
        data = JSON.parse(String(data))
        let data_status = data["status"]
        
        // update the client
        client_socket.send(data)

        console.log('status: %s', data_status)
      }
      


    // } catch (err) {
    //     // socket.close()
    //     console.log("failed to ws_classify")
    // }
}