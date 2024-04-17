import { Schema, model } from "mongoose";

const chatSchema = Schema(
  {
    members: Array,
  },
  {
    timestamps: true,
  }
);

export default model("Chat", chatSchema);
