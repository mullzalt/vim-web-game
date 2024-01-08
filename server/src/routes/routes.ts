import { Router } from "express";
import oauth from "./session/oauth.route";
import me from "./user/me.route";
import auth from "./auth/auth.route";
import game from "./games/game.route";
import learn from "../controllers/collection/collection.controller";
import collection from "./collection/collection.route";

const router = Router();

router.use("/sessions", oauth);
router.use("/me", me);
router.use("/auth", auth);
router.use("/games", game);
router.get("/learns", learn.GET_TUTORIAL);
router.use("/collections", collection);

export default router;
