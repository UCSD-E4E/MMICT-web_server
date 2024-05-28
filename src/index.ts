import express, { Request, Response, NextFunction } from 'express';
import routes from './routes';
import cors from 'cors';
import mongoose from 'mongoose';
import { errorHandler } from './error';
import helmet from 'helmet';

import * as http from 'http';
import WebSocket from 'ws';
import expressWs from 'express-ws';

require('dotenv').config();

const app = express();
let ews = expressWs(app)

//Notice this is a WebSocket url, after SSL certification ideally this will be at wss:// instead of ws://
const IP_SERVICE_URL = `ws://${process.env.IP_ADDRESS}/ws-process`

//This may or may not be necessary; this will be more clear once we try this over the production-ready network
app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    `connect-src 'self' ws://${process.env.IP_ADDRESS}`
  );
  next();
});

ews.app.ws('/ws/echo', function(ws, req) {
    ws.on('message', function(msg) {
      ws.send(msg);
    });
});

// Main classify enpoint, open websocket to IP
ews.app.ws('/ws/classify', function(ws, req) {
    const ws_ipService = new WebSocket(IP_SERVICE_URL)
    ws_ipService.on('error', console.error);
    //Send messages received from ip service back to frontend
    ws_ipService.on('message', function message(data) {
        //Anything necessary in terms of uploading to Mongo will occur here
        ws.send(data);
    });
    //Send messages from frontend to ip service
    ws.on('message', function(msg) {
      ws_ipService.send(msg);
    });
});

declare global {
    type $TSFixMe = any

    namespace Express {
        interface Request {
            user?: $TSFixMe
            files?: $TSFixMe
        }
    }
}

// enable cors
app.use(cors());

// use helmet for more security
app.use(helmet());

app.use(helmet.contentSecurityPolicy({
    //useDefaults:true,
    directives:{
        "connect-src": ["'self'", `ws://${process.env.IP_ADDRESS}`]
    }
}));

// parse json request body
app.use(express.json());

app.use(routes);

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
    res.status(200).send('<h1>It Works!</h1>');
})

app.use(errorHandler)

// Express server listening on this port
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
});