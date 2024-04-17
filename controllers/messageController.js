import Message from "../chatModels/messageModel.js";
import Chat from "../chatModels/chatModel.js";
import { responseBody } from "../utils/ResponseBody.js";

export async function createMessage(req, res) {
  const { chatId, senderId, text } = req.body;
  if (!chatId || !senderId || !text)
    return res
      .status(400)
      .json(responseBody("failed", "Missing parameters", 400, null));

  try {
    const message = await Message.create({ chatId, senderId, text });
    await Chat.findByIdAndUpdate(chatId, {
      updated_at: new Date(),
    });
    return res
      .status(201)
      .json(
        responseBody("success", "message created successfully", 201, {
          message,
        })
      );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseBody("failed", "Internal server error", 500, null));
  }
}

export async function getMessages(req, res) {
  const { chatId } = req.params;
  if (!chatId)
    return res
      .status(400)
      .json(responseBody("failed", "Missing parameters", 400, null));

  try {
    const messages = await Message.find({ chatId });
    return res
      .status(200)
      .json(responseBody("success", "messages retrieved", 201, { messages }));
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseBody("failed", "Internal server error", 500, null));
  }
}
