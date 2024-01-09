import express from "express";
import leaderboard from "../controllers/leaderboard/leaderboard.controller";
import { requireUser } from "../middlewares/require-user";
import { deserializeUser } from "../middlewares/deserialize-user";

const router = express.Router();

router.get("/", leaderboard.GET);
router.post("/me", deserializeUser, requireUser, leaderboard.GET_ME);

export default router;
