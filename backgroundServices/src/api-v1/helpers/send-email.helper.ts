import nodemailer from "nodemailer";
import dotenvx from "@dotenvx/dotenvx";
import { INodemailerMessage } from "../models/nodemailer.models";
import { transporter } from "../../config/nodemailer.config";

dotenvx.config();

// send user email
export async function sendMail(message: INodemailerMessage) {
  await transporter.verify();

  await transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log("An error occurred:", err);
    }
    console.log("Email successfully sent:", info);
  });
}
