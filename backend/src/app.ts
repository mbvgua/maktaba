import express from "express";
import dotenvx from "@dotenvx/dotenvx";
import authRouter from "./api-v1/routes/auth.routes";

dotenvx.config();

const app = express();

// application middleware
app.use(express.json());
app.use("/v1/auth", authRouter);

export default app;
