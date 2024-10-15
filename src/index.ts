import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import bodyParser from "body-parser";
import Event from "./controllers/event/Event";
import "./cron";
// import { limiter } from "./middleware/limitRate/limitRate";

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  credencial: true,
};

const app = express();
// app.use(limiter);
app.use(cors(corsOptions));
app.use("/webhook", bodyParser.raw({ type: "*/*" }), Event.handleStripeWebhook);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
dotenv.config();

export default app;
