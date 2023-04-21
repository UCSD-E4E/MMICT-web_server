import express, { Request, Response, NextFunction } from 'express';
import routes from './routes';
import cors from 'cors';
import mongoose from 'mongoose';
import { errorHandler } from './error';
import helmet from 'helmet';

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

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
});