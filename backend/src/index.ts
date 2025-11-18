import express from "express";
import dotenvx from "@dotenvx/dotenvx";
import authRouter from "./api-v1/routes/auth.routes";

dotenvx.config();
const port = process.env.PORT;

const app = express();

// application middleware
app.use(express.json());
app.use("/v1/auth", authRouter);

// show port server is working on
app.listen(port, () => {
  console.log(`[server]: server running at http://localhost:${port}`);
});
