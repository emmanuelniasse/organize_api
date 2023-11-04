// LIBRAIRIES
import express from 'express';
import 'dotenv/config';
// import cors from 'cors';
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
//         origin: ['https://organize-kappa.vercel.app'],
//         methods: ['POST', 'DELETE', 'POST', 'PUT', 'PATCH'],
//     })
// );
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers'
    );
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Private-Network', true);
    //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
    res.setHeader('Access-Control-Max-Age', 7200);

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
