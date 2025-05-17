import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";

const Apikey = process.env.Apikey;
let io: Server | null = null;

const connectedUsers = new Map<string, string>();

interface AuthenticatedSocket extends Socket {
  userId: string;
}

export const initializeSocket = (httpServer: HttpServer): void => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });
  io.use((socket, next) => {
    const apiKeyHeader = socket.handshake.headers["api-key"];
    const apiKey = Array.isArray(apiKeyHeader)
      ? apiKeyHeader[0]?.toLowerCase()
      : apiKeyHeader?.toLowerCase();

    if (apiKey === Apikey?.toLowerCase()) {
      return next();
    }
    return next(new Error("Invalid API key"));
  });

  //   io.use((socket: Socket, next) => {
  //     const userId = socket.handshake.auth.userId;
  //     if (!userId || typeof userId !== 'string') {
  //       return next(new Error("Invalid user ID"));
  //     }

  //     (socket as AuthenticatedSocket).userId = userId;
  //     next();
  //   });

  io.on("connection", (socket: Socket) => {
    const authenticatedSocket = socket as AuthenticatedSocket;

    console.log(`User connected with socket id: ${authenticatedSocket.id}`);
    connectedUsers.set(authenticatedSocket.userId, authenticatedSocket.id);

    socket.on("disconnect", () => {
      console.log(
        `User disconnected with socket id: ${authenticatedSocket.id}`
      );
      connectedUsers.delete(authenticatedSocket.userId);
    });
  });
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const getConnectedUsers = (): Map<string, string> => connectedUsers;
