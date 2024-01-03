import express from "express";
import { refreshAccessTokenHandler } from "../../controllers/auth/refresh-token.controller";
import { deserializeUser } from "../../middlewares/deserialize-user";
import { requireUser } from "../../middlewares/require-user";
import { signOutHandler } from "../../controllers/auth/signout.controller";

const router = express.Router();

router.get("/refresh", refreshAccessTokenHandler);

router.get("/signout", deserializeUser, requireUser, signOutHandler);

export default router;
