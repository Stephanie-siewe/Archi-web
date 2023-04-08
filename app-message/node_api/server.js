import 'dotenv/config';

import bodyParser from 'body-parser';
import express from 'express';

import routes from './routes/api.js';

const app = express();

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(routes)

app.listen(process.env.PORT || 3001, () => {
  console.log(`server is listening to port ${process.env.PORT}`)
});