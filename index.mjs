// LIBRAIRIES
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const router = express.Router();

// DATABASE Connexion
import * as dbConnect from './router/dbConnect/dbConnect.js';
dbConnect.connect();

// ROUTERS
import { authRouter } from './router/authRouter.js';
import { usersRouter } from './router/usersRouter.js';
import { expensesRouter } from './router/expensesRouter.js';
import { categoriesRouter } from './router/categoriesRouter.js';
import { authVerification } from './router/authVerification.js';

app.use(cookieParser());

// app.use(
//     cors({
//         origin: 'https://organize-kappa.vercel.app',
//         credentials: true, // pour envoyer les cookies au client
//         allowedHeaders: ['Content-Type', 'Authorization'], // pour autoriser le header Content-Type et Authorization dans les requêtes envoyées au serveur (pour les cookies)
//         methods: ['GET', 'POST', 'PUT', 'DELETE'], // pour autoriser les requêtes GET, POST, PUT, DELETE depuis le client
//         })
// );
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With','content-type', 'Authorization', 'Content-Type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router); // Uniquement "/" car tout est géré dans les routers
app.use('/', usersRouter);
app.use('/', authRouter);
app.use('/', authVerification, expensesRouter);
app.use('/', categoriesRouter);

app.listen(process.env.PORT, () => {
    console.log('Server listening on port ' + process.env.PORT);
});
// Export Express API
export { app };
