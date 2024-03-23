import express from "express";
const router = express.Router();
import {
  createMessage,
  getMessages,
} from "../controllers/messageController.js";
import requireAuth from "../middlewares/requireAuth.js";

router.use(requireAuth);

router.post("/", createMessage);
router.get("/:chatId", getMessages);

export { router as messageRoute };
