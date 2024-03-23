import express from "express";
const router = express.Router();
import {
  createTask,
  getTaskDetails,
  applyForTask,
  acceptApplicant,
  listApplications,
} from "../controllers/taskController.js";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import requireAuth from "../middlewares/requireAuth.js";

router.use(requireAuth);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const upload = multer({ dest: __dirname + "../public/uploads/" });

router.post("/", upload.single("image"), createTask);
router.post("/:taskId/apply/", applyForTask);
router.post("/accept/", acceptApplicant);
router.get("/:taskId", getTaskDetails);
router.get("/:taskId/applications", listApplications);

export { router as taskRoute };
