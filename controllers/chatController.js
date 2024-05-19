import Chat from "../chatModels/chatModel.js";
import { responseBody } from "../utils/ResponseBody.js";

export const createChat = async (req, res) => {
  const { id } = req.user;
  const { employerId, employeeId } = req.body;
  try {
    if (!employerId || !employeeId)
      return res
        .status(400)
        .json(responseBody("failed", "Missing parameters", 400, null));
    if (id !== parseInt(employerId) && id !== parseInt(employeeId)) {
      console.log(id, employeeId, employerId);
      return res
        .status(403)
        .json(
          responseBody(
            "forbidden",
            "You are not authorized to perform this action",
            403,
            null
          )
        );
    }

    const tasks = await prisma.tasks.findMany({
      where: {
        Employer_id: parseInt(employerId),
        applicants: {
          some: {
            employeeId: parseInt(employeeId),
            accepted: true,
          },
        },
      },
    });

    if (tasks.length === 0) {
      return res
        .status(403)
        .json(
          responseBody(
            "forbidden",
            "Unauthorized: Employee is not accepted in any of the employer's tasks",
            403,
            null
          )
        );
    }

    const chat = await Chat.findOne({
      members: { $all: [employerId, employeeId] },
    });
    if (chat)
      return res
        .status(200)
        .json(responseBody("success", "found chat", 200, { chat }));
    const newchat = await Chat.create({
      members: [employerId, employeeId],
    });
    return res.status(201).json(
      responseBody("success", "chat created successfully", 201, {
        chat: newchat,
      })
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseBody("failed", "Internal server error", 500, err));
  }
};

export const getUserChats = async (req, res) => {
  const { id } = req.user;
  const { userId } = req.params;

  if (parseInt(userId) !== id) {
    return res
      .status(403)
      .json(
        responseBody(
          "forbidden",
          "You are not allowed to access this resource.",
          403,
          null
        )
      );
  }
  try {
    const chats = await Chat.find({
      members: { $in: [userId] },
    });
    return res
      .status(200)
      .json(responseBody("success", "chats list", 200, { chats }));
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseBody("failed", "Internal server error", 500, null));
  }
};

export const findChat = async (req, res) => {
  const { id } = req.user;
  const { employerId, employeeId } = req.params;
  try {
    if (!employerId || !employeeId)
      return res
        .status(400)
        .json(responseBody("failed", "Missing parameters", 400, null));

    if (id !== parseInt(employerId) && id !== parseInt(employeeId)) {
      return res
        .status(403)
        .json(
          responseBody(
            "forbidden",
            "You are not authorized to perform this action",
            403,
            null
          )
        );
    }

    const chat = await Chat.findOne({
      members: { $all: [employerId, employeeId] },
    });
    if (chat)
      return res
        .status(200)
        .json(responseBody("success", "found chat", 200, chat));
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseBody("failed", "Internal server error", 500, null));
  }
};
