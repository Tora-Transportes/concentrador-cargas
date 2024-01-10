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
//import ClearCachMiddleware from "./middlewares/ClearCach";
import Socket from "./socket";
import socketsRoutes from "./socketsRoutes";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({ limit: "500mb" }));
app.use(cors());
app.use(process.env.BASE_URL || "", routes);
app.use(ErrorMiddleware);
//app.use(ClearCachMiddleware);

const server = https.createServer(
  {
    key: fs.readFileSync(
      path.resolve(__dirname, "..", "certificates", "tora.key")
    ),
    cert: fs.readFileSync(
      path.resolve(__dirname, "..", "certificates", "tora.crt")
    ),
  },
  app
);

Socket.createServer(server);
Socket.handleUsersConnected(socketsRoutes);
server.listen(Number(process.env.PORT) || 3333, "0.0.0.0");
//export default server;
