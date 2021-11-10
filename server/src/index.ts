import "express-async-errors";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import ErrorMiddleware from "./middlewares/Error";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(process.env.BASE_URL || "", routes);
app.use(ErrorMiddleware);

app.listen(process.env.PORT || 3333);
