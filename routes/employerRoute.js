import express from "express";
const router = express.Router();
import { getEmployerTasks } from "../controllers/employerController.js";

import requireAuth from "../middlewares/requireAuth.js";

router.use(requireAuth);

router.get("/:employerId/tasks", getEmployerTasks);

export { router as employerRoute };
