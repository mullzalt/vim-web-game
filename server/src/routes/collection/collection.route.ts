import express from "express";
import { googleOauthHandler } from "../../controllers/auth/google-oauth.controller";
import { requireUser } from "../../middlewares/require-user";
import { deserializeUser } from "../../middlewares/deserialize-user";
import { validate } from "../../middlewares/validate";
import { createGameSchema } from "../../schemas/game.schema";
import collectionController from "../../controllers/collection/collection.controller";

const router = express.Router();

router.get("/", collectionController.GET);
router.get("/:id", collectionController.GET_BY_ID);
router.post(
  "/",
  deserializeUser,
  requireUser,
  validate(createGameSchema),
  collectionController.POST,
);
router.put(
  "/:id",
  deserializeUser,
  requireUser,
  validate(createGameSchema),
  collectionController.PUT,
);

export default router;
