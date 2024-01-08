import express from "express";
import { deserializeUser } from "../../middlewares/deserialize-user";
import { requireUser } from "../../middlewares/require-user";
import { getMeHandler } from "../../controllers/user/me";
import { updateUsernameHandler } from "../../controllers/user/username";

const router = express.Router();

router.use(deserializeUser, requireUser);

router.get("/", getMeHandler);
router.put("/", updateUsernameHandler);

export default router;
