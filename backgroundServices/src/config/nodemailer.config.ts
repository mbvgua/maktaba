import nodemailer from "nodemailer";
import dotenvx from "@dotenvx/dotenvx";

import { INodemailerConfig } from "../api-v1/models/nodemailer.models";

dotenvx.config();

// create config object
const nodemailerConfig: INodemailerConfig = {
  host: "smtp.gmail.com",
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.USER_PASS,
  },
};

// create transporter
const transporter = nodemailer.createTransport(nodemailerConfig);

// verify Transporter
async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log("[server] email server is ready...");
  } catch (error) {
    console.log("[server] email server error", error);
    // stop server with an error code
    process.exit(1);
  }
}

verifyEmailConnection();
export default transporter;
