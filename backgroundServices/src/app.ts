import express from "express";
import cron from "node-cron";
import { sendWelcomeEmail } from "./api-v1/services/welcome-user.service";
import { sendVerifyEmail as sendVerificationEmail } from "./api-v1/services/verify-email.service";

const app = express();

// set app middleware
app.use(express.json());

// runs every a minute
// cron.schedule("* * * * *", () => {
cron.schedule("*/30 * * * * *", () => {
  console.log("Cron job started at: ", new Date());
  try {
    sendWelcomeEmail();
    // sendVerificationEmail();
  } catch (error) {
    console.log("cron job failed: ", error);
  }
});

export default app;
