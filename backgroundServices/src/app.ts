import express from "express";
import cron from "node-cron";
import { sendWelcomeEmail } from "./api-v1/services/welcome-user.service";

const app = express();

// set app middleware
app.use(express.json());

// runs every a minute
cron.schedule("* * * * * *", () => {
    sendWelcomeEmail()
});

export default app;
