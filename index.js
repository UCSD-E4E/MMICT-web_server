const express = require('express');
const cors = require('cors');
const routes = require('./routes');

require('dotenv').config();

const app = express();

// enable cors
app.use(cors());

// parse json request body
app.use(express.json());

app.use(routes);

app.get('/', (req, res) => {
    res.status(200).send('<h1>It Works!</h1>');
})

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
});