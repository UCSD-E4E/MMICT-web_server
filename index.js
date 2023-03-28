const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
const routes = require('./routes');
const mongoose = require('mongoose');
const { errorHandler } = require('./error');

require('dotenv').config();

const app = express();

// enable cors
app.use(cors());

// use helmet for more security
app.use(helmet());

// parse json request body
app.use(express.json());

app.use(routes);

mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
  }).catch(err => console.log(err.reason));

const db = mongoose.connection
db.once('open', _ => {
    console.log('Database connected:', process.env.MONGO_CONNECTION_STRING)
})

db.on('error', err => {
    console.error('connection error:', err)
})

app.get('/', (req, res) => {
    res.status(200).send('<h1>It Works!</h1>');
})

app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
});