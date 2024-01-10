require("dotenv").config();
import path from "path";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import { prisma } from "./utils/prisma";
import validateEnv from "./utils/validate-env";
import config from "config";
import { RequestError } from "./utils/error";
import routes from "./routes/routes";

validateEnv();

const app = express();

async function bootstrap() {
  app.use(express.json({ limit: "10kb" }));

  app.use(cookieParser());

  if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

  app.use("/api/images", express.static(path.join(__dirname, "../public")));

  app.use(
    cors({
      origin: [
        config.get<string>("origin"),
        "https://vi-word.up.railway.app",
        "http://localhost:3000",
        "http://localhost:5173",
      ],
      credentials: true,
    }),
  );

  app.use("/api", routes);

  app.get("/api/checkhealth", (_, res: Response) => {
    return res.status(200).json({
      status: "success",
      message: "App is alive",
    });
  });

  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    return next(new RequestError(404, `Could not find ${req.originalUrl}`));
  });

  app.use(
    (err: RequestError, req: Request, res: Response, next: NextFunction) => {
      err.status = err.status || "error";
      err.status_code = err.status_code || 500;
      const stack =
        process.env.NODE_ENV === "development" ? err.stack : undefined;

      return res.status(err.status_code).json({
        status: err.status,
        message: err.message,
        stack,
      });
    },
  );

  try {
    await prisma.$connect();
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  const port = config.get<number>("port");
  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
}

bootstrap()
  .catch((err) => {
    throw err;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
