import prisma from "../db/prisma.js";
import { responseBody } from "../utils/ResponseBody.js";

const createTask = async (req, res) => {
  const { id } = req.user;
  const {
    title,
    description,
    category,
    employerId,
    posting_date,
    deadline,
    country,
    city,
    address,
    price_range,
    note,
  } = req.body;
  const image = req.file;

  if (
    !title ||
    !description ||
    !category ||
    !employerId ||
    !deadline ||
    !address
  ) {
    return res
      .status(400)
      .json(responseBody("failed", "Missing parameters", 400, null));
  }

  try {
    if (parseInt(employerId) !== id) {
      return res
        .status(403)
        .json(
          responseBody(
            "forbidden",
            "Unauthorized: employer is not the logged in user",
            403,
            null
          )
        );
    }
    const foundCategory = await prisma.category.findFirst({
      where: { name: category },
    });
    if (!foundCategory) {
      return res
        .status(404)
        .json("failed", "Category not found", 404, { category });
    }

    const newTask = await prisma.Tasks.create({
      data: {
        Title: title,
        Descr: description,
        posting_date: new Date(posting_date),
        deadline: new Date(deadline),
        country,
        city,
        Address: address,
        price_range,
        img: image ? image.path : null,
        note,
        category: { connect: { id: foundCategory.id } },
        Employer: { connect: { id: employerId } },
      },
    });

    res
      .status(201)
      .json(
        responseBody("success", "task created successfully", 201, { newTask })
      );
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json(responseBody("failed", error.message, 500, null));
  }
};

const getTaskDetails = async (req, res) => {
  const { taskId } = req.params;
  console.log(parseInt(taskId));

  if (!taskId || isNaN(parseInt(taskId)))
    return res
      .status(400)
      .json(responseBody("failed", "Missing parameters", 400, null));

  try {
    const task = await prisma.tasks.findUnique({
      where: {
        id: parseInt(taskId),
      },
      include: {
        category: true,
        applicants: true,
      },
    });

    if (!task) {
      return res
        .status(404)
        .json(responseBody("failed", "Task not found", 404, null));
    }

    res.json(responseBody("success", "task found", 200, { task }));
  } catch (error) {
    console.error("Error getting task details:", error);
    res
      .status(500)
      .json(responseBody("failed", "Internal server error", 500, null));
  }
};

const applyForTask = async (req, res) => {
  const { id } = req.user;
  const { taskId } = req.params;
  const {
    employeeId,
    coverLetter,
    deadline,
    similarProject,
    note,
    expectedBudget,
  } = req.body;

  if (!employeeId || !taskId || !expectedBudget) {
    return res
      .status(400)
      .json(responseBody("failed", "Missing parameters", 400, null));
  }

  if (parseInt(employeeId) !== id) {
    return res
      .status(403)
      .json(
        responseBody(
          "forbidden",
          "Unauthorized: employee is not the logged in user",
          403,
          null
        )
      );
  }

  try {
    const acceptedApplicationsCount = await prisma.application.count({
      where: {
        taskId: parseInt(taskId),
        accepted: true,
      },
    });

    if (acceptedApplicationsCount > 0) {
      return res
        .status(400)
        .json(
          responseBody(
            "failed",
            "Task already accepted by another employee",
            400,
            null
          )
        );
    }

    const task = await prisma.tasks.findUnique({
      where: {
        id: parseInt(taskId),
      },
    });
    if (!task) {
      return res
        .status(404)
        .json(responseBody("failed", "Task not found", 404, null));
    }

    const newApplication = await prisma.application.create({
      data: {
        task: { connect: { id: parseInt(taskId) } },
        employee: { connect: { id: parseInt(employeeId) } },
        coverLetter,
        deadline: new Date(deadline),
        similarProject,
        note,
        expectedBudget: parseFloat(expectedBudget),
      },
    });

    res.status(201).json(
      responseBody("success", "Application created successfully", 201, {
        newApplication,
      })
    );
  } catch (error) {
    console.error("Error applying to task:", error);
    res
      .status(500)
      .json(responseBody("failed", "Internal server error", 500, null));
  }
};

const acceptApplicant = async (req, res) => {
  const { id } = req.user;
  const { employerId, applicationId } = req.body;

  if (!employerId || !applicationId) {
    return res
      .status(400)
      .json(responseBody("failed", "Missing parameters", 400, null));
  }

  if (parseInt(employerId) !== id) {
    return res
      .status(403)
      .json(
        responseBody(
          "forbidden",
          "Unauthorized: employer is not the logged in user",
          403,
          null
        )
      );
  }

  try {
    const application = await prisma.application.findUnique({
      where: {
        id: parseInt(applicationId),
      },
      include: {
        task: true,
      },
    });
    if (!application || !application.task) {
      return res
        .status(404)
        .json(
          responseBody("failed", "No application found with that ID", 404, null)
        );
    }
    if (application.task.Employer_id !== parseInt(employerId)) {
      return res
        .status(403)
        .json(
          responseBody(
            "forbidden",
            "Unauthorized: You are not the owner of the task",
            403,
            null
          )
        );
    }
    const updatedTask = await prisma.tasks.update({
      where: {
        id: application.taskId,
      },
      data: {
        price: parseFloat(application.expectedBudget),
        deadline: application.deadline,
        status: "In progress",
      },
      include: {
        category: true,
      },
    });

    await prisma.application.update({
      where: {
        id: parseInt(applicationId),
      },
      data: {
        accepted: true,
      },
    });

    res.json(
      responseBody("success", "Application accepted successfully", 200, {
        task: updatedTask,
      })
    );
  } catch (error) {
    console.error("Error accepting application:", error);
    res
      .status(500)
      .json(responseBody("failed", "Internal server error", 500, null));
  }
};

const listApplications = async (req, res) => {
  const { taskId } = req.params;

  if (!taskId)
    return res
      .status(400)
      .json(responseBody("failed", "Missing parameters", 400, null));
  try {
    const task = await prisma.tasks.findUnique({
      where: {
        id: parseInt(taskId),
      },
    });
    if (!task)
      return res
        .status(404)
        .json(responseBody("failed", "Task not Found", 404, null));
    const applications = await prisma.application.findMany({
      where: {
        taskId: parseInt(taskId),
      },
      include: {
        employee: true,
      },
    });
    if (!applications) {
      return res
        .status(404)
        .json(responseBody("failed", "No Applications Found", 404, null));
    }
    res.json(
      responseBody("success", "applications for task retrieved", 200, {
        applications,
      })
    );
  } catch (err) {
    console.log("Error getting applications", err);
    res
      .status(500)
      .json(responseBody("failed", "Internal server error", 500, null));
  }
};

export {
  createTask,
  getTaskDetails,
  applyForTask,
  acceptApplicant,
  listApplications,
};
