import express from "express";
import gameController from "../../controllers/game/game.controller";
import scoreController from "../../controllers/game/score.controller";
import { requireUser } from "../../middlewares/require-user";
import { deserializeUser } from "../../middlewares/deserialize-user";
import { validate } from "../../middlewares/validate";
import { createGameSchema, scoreSchema } from "../../schemas/game.schema";

const router = express.Router();

router.get("/", gameController.GET);
router.get("/:id", gameController.GET_BY_ID);
router.get("/:gameId/scores", scoreController.GET);
router.post(
  "/",
  deserializeUser,
  requireUser,
  validate(createGameSchema),
  gameController.POST,
);
router.post(
  "/:gameId/scores",
  deserializeUser,
  requireUser,
  validate(scoreSchema),
  scoreController.POST,
);
router.put(
  "/:id",
  deserializeUser,
  requireUser,
  validate(createGameSchema),
  gameController.PUT,
);

export default router;
