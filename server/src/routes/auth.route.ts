import express from "express";
import {
  loginHandler,
  logoutHandler,
  registerHandler,
} from "../controllers/auth.controller";
import { deserializeUser } from "../middlewares/deserialize-user";
import { requireUser } from "../middlewares/require-user";
import { validate } from "../middlewares/validate";
import { createUserSchema, loginUserSchema } from "../schemas/user.schema";

const router = express.Router();

router.post("/register", validate(createUserSchema), registerHandler);
router.post("/login", validate(loginUserSchema), loginHandler);
router.get("/logout", deserializeUser, requireUser, logoutHandler);

export default router;
