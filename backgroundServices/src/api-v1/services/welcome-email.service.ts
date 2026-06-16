import dotenvx from "@dotenvx/dotenvx";
import path from "path";

import { pool } from "../../config/mysql.config";
import { IUser } from "../models/user.models";
import { sendMail } from "../helpers/send-email.helper";
import { INodemailerMessage } from "../models/nodemailer.models";
import { logger } from "../../config/winston.config";
import { nunjucksEnv } from "../../config/nunjucks.config";

dotenvx.config({ path: path.resolve(__dirname, "../../../.env") });
const WELCOME_TEMPLATE = "welcome-email.html";

export async function sendWelcomeEmail() {
  // create connection pool
  const connection = await pool.getConnection();

  try {
    //NOTE: is_welcomed if false since its a boolean. hence default to 0
    //is_deleted is an ENUM() hence "false"
    const rows: any = await connection.query(
      `SELECT * FROM users WHERE is_welcomed=false AND is_deleted="false";`,
    );
    const welcomeEmailPending = rows[0] as IUser[];

    if (welcomeEmailPending.length > 0) {
      welcomeEmailPending.forEach(async (user) => {
        const data = nunjucksEnv.render(WELCOME_TEMPLATE, {
          name: user.username,
          email: user.email,
        });

        //define email contents
        let message: INodemailerMessage = {
          from: process.env.USER_MAIL,
          to: user.email,
          subject: "Welcome to Maktaba",
          html: data,
        };

        //send the email
        await sendMail(message);

        // update db to prevent infinite loop
        await connection.query(
          "UPDATE users SET is_welcomed=true WHERE id=?;",
          [user.id],
        );

        // log occurrence in log files only, cannot return things
        // as that terminates execution. also loggin to console
        // is good only for dev, not so much in prod
        logger.log({
          level: "info",
          message: `Welcome email successfully sent out to ${user.id}.`,
          data: {
            username: user.username,
            email: user.email,
          },
        });
      });
    } else {
      // inform that theres nothing to do. even though its to console
      // the info is essential
      console.log({
        status: "success",
        message: "All welcome emails have successfully been sent out",
      });
    }
  } catch (error) {
    //log the error
    logger.log({
      level: "error",
      message: "Internal server error occurred while sending a welcome email",
      data: { error },
    });
  } finally {
    //release connection pool
    connection.release();
  }
}
