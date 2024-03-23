import prisma from "../db/prisma.js";
import { responseBody } from "../utils/ResponseBody.js";

const getEmployeeTasks = async (req, res) => {
  const { employeeId } = req.params;
  const { status } = req.query;

  if (!employeeId)
    return res
      .status(400)
      .json(responseBody("failed", "Missing parameters", 400, null));

  try {
    const user = await prisma["employee"].findUnique({
      where: {
        id: parseInt(employeeId),
      },
    });
    if (!user) {
      return res
        .status(404)
        .json(responseBody("failed", "user not found", 404, null));
    }

    const acceptedApplications = await prisma.application.findMany({
      where: {
        employeeId: parseInt(employeeId),
        accepted: true,
      },
      include: {
        task: {
          include: {
            category: true,
          },
        },
      },
    });

    let acceptedTasks = acceptedApplications.map(
      (application) => application.task
    );

    if (status) {
      acceptedTasks = acceptedTasks.filter((task) => task.status === status);
    }

    res.json(
      responseBody("success", "employee tasks", 200, { tasks: acceptedTasks })
    );
  } catch (error) {
    console.error("Error getting accepted tasks:", error);
    res
      .status(500)
      .json(responseBody("failed", "Internal server error", 500, null));
  }
};

const getEmpAppliedJobs = async (req, res) => {
  const { employeeId } = req.params;

  if (!employeeId)
    return res
      .status(400)
      .json(responseBody("failed", "Missing parameters", 400, null));

  try {
    const user = await prisma["employee"].findUnique({
      where: {
        id: parseInt(employeeId),
      },
    });
    if (!user) {
      return res
        .status(404)
        .json(responseBody("failed", "user not found", 404, null));
    }
    let applications = await prisma.application.findMany({
      where: {
        employeeId: parseInt(employeeId),
      },
      include: {
        task: {
          include: {
            category: true,
            applicants: true,
          },
        },
      },
    });

    applications = applications.map((application) => application.task);

    res.json(
      responseBody("success", "tasks that employee applied to", 200, {
        applications,
      })
    );
  } catch (error) {
    console.error("Error getting accepted tasks:", error);
    res
      .status(500)
      .json(responseBody("failed", "Internal server error", 500, null));
  }
};

export { getEmpAppliedJobs, getEmployeeTasks };
