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
const usersRouter = require('./router/usersRouter');
const expensesRouter = require('./router/expensesRouter');
const categoriesRouter = require('./router/categoriesRouter');

app.use(cors());
app.use(express.json());
app.use(router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Uniquement "/" car tout est géré dans les routers
app.use('/', usersRouter);
app.use('/', expensesRouter);
app.use('/', categoriesRouter);

app.listen(process.env.PORT, () => {
    console.log('Server listening on port ' + process.env.PORT);
});

// Export the Express API
module.exports = app;
