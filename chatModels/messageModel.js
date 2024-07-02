import { Schema, model } from "mongoose";

const MessageSchema = Schema(
  {
    chatId: String,
    senderId: String,
    text: String,
  },
  {
    timestamps: true,
  }
);

export default model("Message", MessageSchema);
