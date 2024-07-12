import express from "express";
const router = express.Router();
import {
  createTask,
  markTaskAsDone,
  getTaskDetails,
  applyForTask,
  acceptApplicant,
  listApplications,
  listCategories,
  getCategoryTasks,
} from "../controllers/taskController.js";
import multer from "multer";
import requireAuth from "../middlewares/requireAuth.js";
import { tmpdir } from "os";

router.use(requireAuth);

const upload = multer({ dest: tmpdir() });

router.post("/", upload.single("file"), createTask);
router.post("/:taskId/apply/", applyForTask);
router.get("/:taskId", getTaskDetails);
router.get("/:taskId/applications", listApplications);
router.get("/:taskId/markTaskAsDone", markTaskAsDone);
router.get("/applications/:applicationId/accept/", acceptApplicant);
router.get("/categories/:parent", listCategories);
router.get("/category/:category", getCategoryTasks);

export { router as taskRoute };
