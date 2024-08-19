import express, { Request, Response, NextFunction } from 'express';
import routes from './routes';
import cors from 'cors';
import mongoose from 'mongoose';
import { errorHandler } from './error';
import helmet from 'helmet';

import * as http from 'http';
import WebSocket from 'ws';
import expressWs from 'express-ws';
import { Blob } from 'buffer';

const zlib = require('node:zlib');

require('dotenv').config();

declare global {
    type $TSFixMe = any

    namespace Express {
        interface Request {
            user?: $TSFixMe
            files?: $TSFixMe
        }
    }
}

const app = express();
let ews = expressWs(app)

// enable cors
app.use(cors());
// use helmet for more security
app.use(helmet());
// parse json request body
app.use(express.json());

app.use(routes);

app.use(errorHandler)

app.use(helmet.contentSecurityPolicy({
    //useDefaults:true,
    directives:{
        "connect-src": ["'self'", `ws://${process.env.IP_ADDRESS}`]
    }
}));

//Notice this is a WebSocket url, after SSL certification ideally this will be at wss:// instead of ws://
const IP_SERVICE_URL = `ws://${process.env.IP_ADDRESS}/ws-process`
var ws_ipService : WebSocket | undefined = undefined
var socketInUse : Boolean = false
const socketRequestQueue : Array<WebSocket.RawData> = []

// const sendRequest = (req: WebSocket.RawData) => {
//     if(ws_ipService){
//         ws_ipService.send(req)
//         socketInUse = true
//     }
// }

//This may or may not be necessary; this will be more clear once we try this over the production-ready network
app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    `connect-src 'self' ws://${process.env.IP_ADDRESS}`
  );
  next();
});

// Websocket endpoints

// Echo test endpoint
ews.app.ws('/ws/echo', function(ws, req) {
    ws.on('message', function(msg) {
      ws.send(msg + " echoedd");
    });
});

// Main classify enpoint, open websocket to IP
ews.app.ws('/ws/classify', function(ws, req) {
    //Send messages from frontend to ip service
    ws.on('message', function(msg) {
        const ws_ipService = new WebSocket(IP_SERVICE_URL)
        console.log('trying to connect to: ' + IP_SERVICE_URL)
        ws.send('trying to connect to: ' + IP_SERVICE_URL)
        ws_ipService.on('error', (error) => {
            console.log('error connecting to ws: ' + error)
            ws.send('error connecting to ws: ' + error)
            socketInUse = false
        });
        ws_ipService.on('open', () => {
            ws.send('opened socket to ip service successfully')
            ws.send("sending request to ip service")
            if(socketInUse){
                ws.send('socket in use, enqueueing request at position ' + socketRequestQueue.length)
                socketRequestQueue.push(msg)
                return
            }
            ws.send('socket not in use, sending request without enqueuing')
            ws_ipService.send(msg)
            socketInUse = true
        })
        //Send messages received from ip service back to frontend
        ws_ipService.on('message', function message(data) {
            //Anything necessary in terms of uploading to Mongo will occur here
            ws.send(data)
            if(data instanceof Buffer){
                let msg = JSON.parse(data.toString());
                if(msg.geojson_flag === "done"){
                    //Allow request queue to push new request through to websocket
                    ws.send('finished request, socket now available')
                    socketInUse = false
                    if(socketRequestQueue.length > 0){
                        ws.send('popping from queue')
                        const req = socketRequestQueue.shift()
                        if(req){
                            ws.send('sending request from queue')
                            ws_ipService.send(msg)
                            socketInUse = true
                        }
                    }
                }
            }
        });
    });
});

// MongoDB Stuff

mongoose.connect(process.env.MONGO_CONNECTION_STRING as string, {
    serverSelectionTimeoutMS: 5000
  }).catch((err: any) => console.log(err.reason));

const db = mongoose.connection

db.once('open', (_: any) => {
    console.log('Database connected:', process.env.MONGO_CONNECTION_STRING)
})

db.on('error', (err: any) => {
    console.error('connection error:', err)
})

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('<h1>It Works! :DDD</h1>');
})

// Express server listening on this port
app.listen(process.env.PORT, () => {
    console.log(`lllistening on port ${process.env.PORT}`);
    console.log(`trying socket at ${IP_SERVICE_URL}`)
});