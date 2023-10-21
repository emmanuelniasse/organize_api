// LIBRAIRIES
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
const app = express();
const router = express.Router();

// DATABASE Connexion
import * as dbConnect from './router/dbConnect/dbConnect.js';
dbConnect.connect();

// ROUTERS
import { usersRouter } from './router/usersRouter.js';
import { expensesRouter } from './router/expensesRouter.js';
import { categoriesRouter } from './router/categoriesRouter.js';

const corsOptions = {
    origin: 'https://organize-api.vercel.app/', // Remplacez par l'URL de votre client
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router); // Uniquement "/" car tout est géré dans les routers
app.use('/', usersRouter);
app.use('/', expensesRouter);
app.use('/', categoriesRouter);

app.listen(process.env.PORT, () => {
    console.log('Server listening on port ' + process.env.PORT);
});

// Export Express API
export { app };
