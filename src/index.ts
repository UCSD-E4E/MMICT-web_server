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

app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    "connect-src 'self' ws://172.18.0.2:5000"
  );
  next();
});

ews.app.ws('/echo', function(ws, req) {
    ws.on('message', function(msg) {
      console.log("Received: " + msg);
      ws.send("Echoing: " + msg);
    });
    //console.log('socket', req.testing);
});

ews.app.ws('/ip', function(ws, req) {
    const ws_ipService = new WebSocket('ws://172.18.0.2:5000/echo')

    ws_ipService.on('error', console.error);

    ws_ipService.on('open', function open() {
        ws_ipService.send('webserver connected to IP service');
    });

    ws_ipService.on('message', function message(data) {
        ws.send("(echo) IP Service -> Webserver -> " + data);
    });
    ws.on('message', function(msg) {
      console.log("Recevied on Webserver: " + msg);
      ws.send("Webserver Received: " + msg + ", sending to IP service");
      ws_ipService.send(msg);
    });
    //console.log('socket', req.testing);
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
        "connect-src": ["'self'", "ws://172.18.0.2:5000"]
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

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
});