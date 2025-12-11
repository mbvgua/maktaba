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
export const transporter = nodemailer.createTransport(nodemailerConfig);
