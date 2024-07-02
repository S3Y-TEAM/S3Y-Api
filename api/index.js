import express from "express";
import { userNameRoute } from "../routes/UserName.js";
import { categoriesRoute } from "../routes/Categories.js";
import { emailRoute } from "../routes/Email.js";
import { phoneRoute } from "../routes/Phone.js";
import { signUpRoute } from "../routes/SignUp.js";
import { signInRoute } from "../routes/SignIn.js";
import { forgetPasswordRoute } from "../routes/ForgetPassword.js";
import { resetPasswordRoute } from "../routes/ResetPassword.js";
import { logOutRoute } from "../routes/LogOut.js";
// import { taskRoute } from "../routes/taskRoute.js";
import { employeeRoute } from "../routes/employeeRoute.js";
import { employerRoute } from "../routes/employerRoute.js";
import { chatRoute } from "../routes/chatRoute.js";
import { messageRoute } from "../routes/messageRoute.js";
import { userRoute } from "../routes/userRoute.js";
import { paymentRoute } from "../routes/payment.js";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";

import cors from "cors";
const app = express();
import mongoose from "mongoose";

app.use(
  cors({
    exposedHeaders: ["Content-Length", "Content-Type", "Authorization"],
  })
);

mongoose.connect(process.env.MONGO_URL);

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// Middleware for headers
app.use((req, res, next) => {
  res.setHeader("Authorization", "Bearer PlaceHolderToken");
  next();
});
app.use("/api/v1", userNameRoute);
app.use("/api/v1", categoriesRoute);
app.use("/api/v1", emailRoute);
app.use("/api/v1", phoneRoute);
app.use("/api/v1", signUpRoute);
app.use("/api/v1", signInRoute);
app.use("/api/v1", forgetPasswordRoute);
app.use("/api/v1", resetPasswordRoute);
app.use("/api/v1", logOutRoute);
app.use("/api/v1", paymentRoute);
// app.use("/api/v1/tasks", taskRoute);
app.use("/api/v1/employee", employeeRoute);
app.use("/api/v1/employer", employerRoute);
app.use("/api/v1/chats", chatRoute);
app.use("/api/v1/messages", messageRoute);
app.use("/api/v1/user", userRoute);

// limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use(limiter);
// app.listen(PORT, () => {
//   console.log(`app is listening on port ${PORT}`);
// });

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: "http://localhost:3000" });

let onlineUsers = [];

io.on("connection", (socket, req) => {
  socket.on("addNewUser", ({ userId }) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    console.log("online", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((u) => u.userId == message.recipientId);
    console.log("Sending to ", user, message.recipientId);
    if (user) io.to(user.socketId).emit("getMessage", message);
  });
  socket.on("disconnect", () => {
    onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log("offline", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

const server = httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

