const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");

const getSecreteRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "https://localhost:5173",
      credentials: true
    }
  });
  io.on("connection", (socket) => {
    //   Handle events
    console.log("A user connected: " + socket.id);

    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecreteRoomId(userId, targetUserId);
      console.log(firstName + " Joining the room : " + roomId);

      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({ text, firstName, lastName, userId, targetUserId }) => {
        //   console.log(text + " " + firstName + " " + userId + " " + targetUserId);
        //   console.log(firstName + " : " + text);
        try {
          const connection = await connectionRequestModel.findOne({
            $or: [
              {
                fromUserId: userId,
                toUserId: targetUserId,
                status: "accepted"
              },
              { fromUserId: targetUserId, toUserId: userId, status: "accepted" }
            ]
          });

          if (!connection) {
            socket.emit("error", {
              message:
                "You are not connected to this user, so you cannot message them"
            });
            return;
          }

          const roomId = getSecreteRoomId(userId, targetUserId);
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: []
            });
          }
          chat.messages.push({
            senderId: userId,
            text
          });
          await chat.save();
          io.to(roomId).emit("messageReceived", { firstName, lastName, text });
        } catch (error) {}
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
