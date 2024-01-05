import express from "express";
import { googleOauthHandler } from "../../controllers/auth/google-oauth.controller";
import gameController from "../../controllers/game/game.controller";
import { requireUser } from "../../middlewares/require-user";
import { deserializeUser } from "../../middlewares/deserialize-user";
import { validate } from "../../middlewares/validate";
import { createGameSchema } from "../../schemas/game.schema";

const router = express.Router();

router.get("/", gameController.GET);
router.get("/:id", gameController.GET_BY_ID);
router.post(
  "/",
  deserializeUser,
  requireUser,
  validate(createGameSchema),
  gameController.POST,
);
router.put(
  "/:id",
  deserializeUser,
  requireUser,
  validate(createGameSchema),
  gameController.PUT,
);

export default router;
