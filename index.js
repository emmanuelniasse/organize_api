// LIBRAIRIES

const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// DATABASE Connexion
const dbConnect = require('./router/dbConnect/dbConnect.js');
dbConnect.connect();

// ROUTERS
const expensesRouter = require('./router/expensesRouter');

app.use(cors());
app.use(express.json());
app.use(router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Uniquement "/" car tout est géré dans les routers
app.use('/', expensesRouter);

app.listen(process.env.PORT, () => {
    console.log('Server listening on port ' + process.env.PORT);
});

// Export the Express API
module.exports = app;
