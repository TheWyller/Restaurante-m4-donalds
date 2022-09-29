import express, { Request, Response } from "express";
import "reflect-metadata";
import "express-async-errors";
import { handleErrorMiddleware } from "./middlewares/handleError.middleware";
import { appRoutes } from "./routes";

const app = express();
app.use(express.json());

appRoutes(app);

app.use(handleErrorMiddleware);

export default app;
