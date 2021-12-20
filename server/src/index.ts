import "express-async-errors";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";
import path from "path";
import "./jobs";
import routes from "./routes";
import ErrorMiddleware from "./middlewares/Error";
import Socket from "./socket";
import socketsRoutes from "./socketsRoutes";

dotenv.config();

const app = express();

app.use(express.json({ limit: "500mb" }));
app.use(cors());
app.use(process.env.BASE_URL || "", routes);
app.use(ErrorMiddleware);

const server = https.createServer(
  {
    key: fs.readFileSync(
      path.resolve(__dirname, "..", "certificates", "server.key")
    ),
    cert: fs.readFileSync(
      path.resolve(__dirname, "..", "certificates", "server.cert")
    ),
  },
  app
);

Socket.createServer(server);
Socket.handleUsersConnected(socketsRoutes);

server.listen(process.env.PORT || 3333);
