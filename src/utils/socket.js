const socket = require("socket.io");
const crypto = require("crypto");

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
    socket.on("sendMessage", ({ text, firstName, userId, targetUserId }) => {
      console.log(text + " " + firstName + " " + userId + " " + targetUserId);
      const roomId = getSecreteRoomId(userId, targetUserId);
      console.log(firstName + " : " + text);
      io.to(roomId).emit("messageReceived", { firstName, text });
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
