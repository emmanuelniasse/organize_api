// LIBRAIRIES

const express = require('express');
const app = express();
const config = require('./config/config.json');
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');

// DATABASE Connexion
const dbConnect = require('./router/dbConnect/dbConnect.js');
dbConnect.connect();

// ROUTERS
const categoriesRouter = require('./router/categoriesRouter');
const subcategoriesRouter = require('./router/subcategoriesRouter');
const itemsRouter = require('./router/itemsRouter');

app.use(cors());
app.use(express.json());
app.use(router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Uniquement "/" car tout est géré dans les routers
app.use('/', categoriesRouter);
app.use('/', subcategoriesRouter);
app.use('/', itemsRouter);

app.listen(config.PORT, () => {
    console.log('Server listening on port ' + config.PORT);
});

// Export the Express API
module.exports = app;
