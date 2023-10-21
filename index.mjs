// LIBRAIRIES
// const express = require('express');
import express from 'express';
// const cors = require('cors');
// const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
// const dotenv = require('dotenv');
import dotenv from 'dotenv';
import('./use.cjs'); // restart le serveurfig();

// Les app use sont dans ce fichier
// const uses = require('./uses.js');

// DATABASE Connexion
// const dbConnect = require('./router/dbConnect/dbConnect.js');
import * as dbConnect from './router/dbConnect/dbConnect.js';
dbConnect.connect();

// ROUTERS
import { usersRouter } from './router/usersRouter.js';
import { expensesRouter } from './router/expensesRouter.js';
import { categoriesRouter } from './router/categoriesRouter.js';

// mets les app.use dans un fichier séparé peut-être que ça va fonctionner dans le sens de commonjs vers esm
//seulement ceux-ci
// app.use(cors());
// app.use(express.json());
// app.use(router);
// app.use(bodyParser.default.json());
// app.use(bodyParser.default.urlencoded({ extended: true }));
//
app.use(express.json());
app.use(router); // Uniquement "/" car tout est géré dans les routers
app.use('/', usersRouter);
app.use('/', expensesRouter);
app.use('/', categoriesRouter);

app.listen(process.env.PORT, () => {
    console.log('Server listening on port ' + process.env.PORT);
});

// Export the Express API
export { app };
