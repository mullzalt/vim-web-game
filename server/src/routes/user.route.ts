import express from "express";
import { getMeHandler } from "../controllers/user.controller";
import { deserializeUser } from "../middlewares/deserialize-user";
import { requireUser } from "../middlewares/require-user";

const router = express.Router();

router.use(deserializeUser, requireUser);

router.get("/me", getMeHandler);

export default router;
