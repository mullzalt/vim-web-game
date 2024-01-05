import { Router } from "express";
import oauth from "./session/oauth.route";
import me from "./user/me.route";
import auth from "./auth/auth.route";
import game from "./games/game.route";
import collection from "../controllers/collection/collection.controller";

const router = Router();

router.use("/sessions", oauth);
router.use("/me", me);
router.use("/auth", auth);
router.use("/games", game);
router.get("/learns", collection.GET_TUTORIAL);

export default router;
