const socket = require("socket.io");

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
      const roomId = [userId, targetUserId].sort().join("_");
      console.log(firstName + " Joining the room : " + roomId);

      socket.join(roomId);
    });
    socket.on("sendMessage", ({ text, firstName, userId, targetUserId }) => {
      console.log(text + " " + firstName + " " + userId + " " + targetUserId);
      const roomId = [userId, targetUserId].sort().join("_");
      console.log(firstName + " : " + text);
      io.to(roomId).emit("messageReceived", { firstName, text });
      console.log(io.to(roomId).emit("messageReceived", { firstName, text }));
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
