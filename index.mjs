// LIBRAIRIES
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";

const app = express();
const router = express.Router();

// DATABASE Connexion
import * as dbConnect from "./router/dbConnect/dbConnect.js";
dbConnect.connect();

// ROUTERS
import { authRouter } from "./router/authRouter.js";
import { authVerification } from "./router/authVerification.js";
import { categoriesRouter } from "./router/categoriesRouter.js";
import { expensesRouter } from "./router/expensesRouter.js";
import { usersRouter } from "./router/usersRouter.js";

app.use(cookieParser());
app.use(
    cors({
        origin: "*",
        // origin: `${process.env.APP_URL}`,
        allowedHeaders: ["Content-Type", "Authorization"],
        // credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router); // Uniquement "/" car tout est géré dans les routers
app.use("/", usersRouter);
app.use("/", authRouter);
app.use("/", authVerification, expensesRouter);
app.use("/", authVerification, categoriesRouter);

app.listen(process.env.PORT, () => {
    console.log("Server listening on port " + process.env.PORT);
});

// Export Express API
export { app };
