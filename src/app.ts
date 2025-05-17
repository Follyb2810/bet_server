import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { allowedOrigins } from "./config/allowedOrigins";
import cors from "cors";
import morgan from "morgan";
import { connectDb } from "./config/db";
import authRoutes from "./Routes/UserRoutes";
import path from "path";
import crypto from "crypto";

// console.log("UUID:", crypto.randomUUID());
// console.log("Random Bytes (hex):", crypto.randomBytes(256).toString("hex"));

const app = express();
const port = 3000;

const server = http.createServer(app);

const io = new Server(server, {
  allowEIO3: true,
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"],
  },
});
const corsConfig = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsConfig));
app.use(morgan("tiny"));
app.disable("x-powered-by");
app.set("trust proxy", true);
app.use(express.json());
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req: Request, res: Response) => {
  res.send("first server!");
});
app.use("/api/auth", authRoutes);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
);

io.on("connection", (socket: Socket) => {
  socket.emit("me", socket.id);

  socket.on("acknowledge", (value: string) => {
    console.log(value);
  });

  socket.on(
    "callUser",
    (data: { userId: string; signal: any; from: string; name: string }) => {
      io.to(data.userId).emit("callUser", {
        signal: data.signal,
        from: data.from,
        name: data.name,
      });
    }
  );

  socket.on("answerCall", (data: { userid: string; message: string }) => {
    io.to(data.userid).emit("callAccepted", {
      message: data.message,
    });
  });

  socket.on("disconnected", () => {
    socket.broadcast.emit("callEnded", socket.id);
    io.emit("disconnect", {
      system: "chat disconnected",
      message: `User with ID ${socket.id} has left`,
    });
  });
});

connectDb()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => console.log("Invalid database connection: ", error))
  .finally(() => console.log("yes we run finally"));
