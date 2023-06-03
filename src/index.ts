import express, { Request, Response, NextFunction } from 'express';
import routes from './routes';
import cors from 'cors';
import mongoose from 'mongoose';
import { errorHandler } from './error';
import helmet from 'helmet';

import { Server, WebSocket } from 'ws';
import { handle_classify } from './middlewares/ws_classify'

require('dotenv').config();

declare global {
    type $TSFixMe = any

    namespace Express {
        interface Request {
            user?: $TSFixMe
        }
    }
}

const app = express();

// enable cors
app.use(cors());

// use helmet for more security
app.use(helmet());

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

const server = app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
});


// create a websocket server to handle incoming websocket connections
const ws_server:Server = new Server({ noServer: true });
// recieve new connections form the webserver
ws_server.on('connection', socket => {
    handle_classify(socket)
    console.log("handling new ws connection")

});


// set handler for incoming websocket connections
server.on('upgrade', (request, socket, head) => {
ws_server.handleUpgrade(request, socket, head, socket => {
    ws_server.emit('connection', socket, request);
  });
});
