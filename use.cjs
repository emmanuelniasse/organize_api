// import { app } from './index.mjs';
const bodyParser = require('body-parser');
// const bodyParser = require();
const cors = require('cors');

// const app = express();
// const express = app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
