import express from "express";
const router = express.Router();
import findUser from "../controllers/user.js";
import requireAuth from "../middlewares/requireAuth.js";

router.use(requireAuth);

router.get("/:role/:userId", findUser);

export { router as userRoute };
