import express from "express";
const router = express.Router();
import { findUser, updateUserImg } from "../controllers/user.js";
import requireAuth from "../middlewares/requireAuth.js";
import multer from "multer";
import { tmpdir } from "os";

router.use(requireAuth);

const upload = multer({ dest: tmpdir() });

router.get("/:role/:userId", findUser);
router.post("/updateImg", upload.single("image"), updateUserImg);

export { router as userRoute };
