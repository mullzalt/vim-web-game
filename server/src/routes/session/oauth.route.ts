import express from "express";
import { googleOauthHandler } from "../../controllers/auth/google-oauth.controller";

const router = express.Router();

router.get("/oauth/google", googleOauthHandler);

export default router;
