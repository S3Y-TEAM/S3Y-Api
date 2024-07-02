import express from "express";
const router = express.Router();
import {
  createChat,
  getUserChats,
  findChat,
} from "../controllers/chatController.js";
import requireAuth from "../middlewares/requireAuth.js";

router.use(requireAuth);

router.post("/", createChat);
router.get("/:userId", getUserChats);
router.get("/find/:firstId/:secondId", findChat);

export { router as chatRoute };
