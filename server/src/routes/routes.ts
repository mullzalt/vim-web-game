import { Router } from "express";
import oauth from "./session/oauth.route";
import me from "./user/me.route";
import auth from "./auth/auth.route";

const router = Router();

router.use("/sessions", oauth);
router.use("/me", me);
router.use("/auth", auth);

export default router;
