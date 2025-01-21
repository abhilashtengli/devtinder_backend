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
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log(firstName + " Joining the room : " + roomId);

      socket.join(roomId);
    });
    socket.on("sendMessage", () => {});
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
