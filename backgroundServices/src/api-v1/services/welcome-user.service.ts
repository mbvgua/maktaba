import dotenvx from "@dotenvx/dotenvx";
import path from "path";
import fs from "fs";
import nunjucks from "nunjucks";

import { pool } from "../../config/mysql.config";
import { IUser } from "../models/user.models";
import { sendMail } from "../helpers/send-email.helper";
import { INodemailerMessage } from "../models/nodemailer.models";
import { logger } from "../../config/winston.config";

dotenvx.config({ path: path.resolve(__dirname, "../../../.env") });

// get path to html template and compile it
const templatePath = path.resolve(
  __dirname,
  "../../../templates/welcomeEmail.html",
);
const source = fs.readFileSync(templatePath, "utf8");
const compiledTemplate = nunjucks.compile(source);

export async function sendWelcomeEmail() {
  try {
    const connection = await pool.getConnection();
    const rows: any = await connection.query(
      "SELECT * FROM users WHERE is_welcomed=0 AND is_deleted=0;",
    );
    const welcomeEmailPending = rows[0] as IUser[];
    console.log(welcomeEmailPending);
    connection.release();

    if (welcomeEmailPending.length > 0) {
      welcomeEmailPending.forEach(async (user) => {
        const data = compiledTemplate.render({
          name: user.username,
          email: user.email,
        });

        //define email contents
        let message: INodemailerMessage = {
          from: process.env.USER_MAIL,
          to: user.email,
          subject: "Welcome to Maktaba!",
          html: data,
        };

        //send the email
        await sendMail(message);

        // update db to prevent infinite loop
        await connection.query(
          "UPDATE users SET is_welcomed=1 WHERE id=? AND is_deleted=0;",
          [user.id],
        );

        // log occurrence
        logger.log({
          level: "info",
          message: `welcome email successfully sent out to ${user.id}`,
          data: {
            username: user.username,
            email: user.email,
          },
        });

        console.log({
          code: 200,
          status: "success",
          message: `Welcome email sent out to ${user.username} successfully!`,
          data: {
            username: user.username,
            email: user.email,
          },
          metadata: null,
        });
      });
    }
  } catch (error) {
    //log the error
    logger.log({
      level: "error",
      message: "Internal server error occurred while sending a welcome email",
      data: { error },
    });

    // convert this to a return statement maybe?
    console.log({
      code: 500,
      status: "error",
      message: "Internal server error",
      data: { error },
      metadata: null,
    });
  }
}
