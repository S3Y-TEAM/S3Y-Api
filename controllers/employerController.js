import prisma from "../db/prisma.js";
import { responseBody } from "../utils/ResponseBody.js";

const getEmployerTasks = async (req, res) => {
  const { employerId } = req.params;
  const { status } = req.query;

  if (!employerId)
    return res
      .status(400)
      .json(responseBody("failed", "Missing parameters", 400, null));

  try {
    const user = await prisma["Employer"].findUnique({
      where: {
        id: parseInt(employerId),
      },
    });
    if (!user) {
      return res
        .status(404)
        .json(responseBody("failed", "user not found", 404, null));
    }

    let tasksQuery = {
      where: {
        Employer_id: parseInt(employerId),
      },
      include: {
        category: true,
        applicants: true,
      },
    };

    if (status) {
      tasksQuery.where.status = status;
    }

    const tasks = await prisma.tasks.findMany(tasksQuery);

    res
      .status(200)
      .json(
        responseBody("success", "tasks that employer posted", 200, { tasks })
      );
  } catch (e) {
    console.log("Error getting the tasks", e);
    res
      .status(500)
      .json(responseBody("failed", "Internal server error", 500, null));
  }
};

export { getEmployerTasks };
