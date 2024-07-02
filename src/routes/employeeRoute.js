import express from "express";
const router = express.Router();
import {
  getEmpAppliedJobs,
  getEmployeeTasks,
} from "../controllers/employeeController.js";

import requireAuth from "../middlewares/requireAuth.js";

router.use(requireAuth);

router.get("/:employeeId/applications", getEmpAppliedJobs);
router.get("/:employeeId/tasks", getEmployeeTasks);

export { router as employeeRoute };
