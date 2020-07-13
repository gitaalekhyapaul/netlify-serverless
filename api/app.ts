import express, { Express, Request, Response, NextFunction } from "express";
import { config as dotenvConfig } from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import noteRoutes from "./routes/noteRoutes";
import { errorHandler } from "./services/errorHandler";

export class App {
  app: Express = express();
  constructor() {
    this.initMiddlewares();
    this.initRoutes();
    this.initErrorHandlers();
  }
  initMiddlewares() {
    dotenvConfig();
    this.app.use(cors());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }
  initRoutes() {
    this.app.use("/api", noteRoutes);
  }
  initErrorHandlers() {
    this.app.use("*", (req: Request, res: Response, next: NextFunction) => {
      res.sendStatus(405);
    });
    this.app.use(errorHandler);
  }
}
