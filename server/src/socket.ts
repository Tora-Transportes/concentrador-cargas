import { Server, Socket } from "socket.io";
import { Server as HttpsServer } from "http";

let io: Server | null = null;

const users: Record<string, Socket> = {};

function createServer(server: HttpsServer): Server {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  return io;
}

function getInstance(): Server {
  if (io === null) {
    throw new Error("Instance not initialized");
  }
  return io;
}

function handleUsersConnected(registerEvents: (socket: Socket) => void): void {
  getInstance().on("connect", (socket) => {
    console.log(`User ${socket.id} connected`);
    users[socket.id] = socket;

    registerEvents(socket);

    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
      socket.disconnect();
      delete users[socket.id];
    });
  });
}

function getAllSockets() {
  return Object.keys(users).map((key) => users[key]);
}

export default {
  createServer,
  getInstance,
  handleUsersConnected,
  getAllSockets,
};
