import nodemailer from "nodemailer";
import dotenvx from "@dotenvx/dotenvx";

import { INodemailerMessage } from "../models/nodemailer.models";
import { logger } from "../../config/winston.config";
import transporter from "../../config/nodemailer.config";

dotenvx.config();

// send user email
export async function sendMail(message: INodemailerMessage) {
  await transporter.sendMail(message, (err, info) => {
    if (err) {
      // to my log files
      logger.log({
        level: "error",
        message: "Nodemailer encountered error sending email",
        data: { err },
      });

      // and to the console
      console.log({
        status: "error",
        message: `An error occurred while sending email with nodemailer: ${err}`,
      });
    }
    /*
     *
     * info.accepted -> who you're sending to
     * info.envelope -> from and to as an array
     * used later incase of cc, have all names listed, i think?
     */
    console.log("email successfully sent to :", info.envelope["to"]);
    logger.log({
      level: "info",
      message: `Email successfully sent to ${info.envelope["to"]}`,
      data: {
        email_id: info.messageId,
        sent_to: info.envelope["to"],
        sent_from: info.envelope["from"],
      },
    });
  });
}
