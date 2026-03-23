import dotenvx from "@dotenvx/dotenvx";

import { pool } from "../../config/mysql.config";
import { nunjucksEnv } from "../../config/nunjucks.config";
import { logger } from "../../config/winston.config";
import { sendMail } from "../helpers/send-email.helper";
import { INodemailerMessage } from "../models/nodemailer.models";
import { IUser } from "../models/user.models";

dotenvx.config();
const FORGOT_PASSWORD_TEMPLATE = "forgot-password.html";
//  NOTE: send this for now. when building frontend is compelete send that instead.
const FORGOT_PASSWORD_LINK = "http://localhost:4000/v1/auth/change-password";

export async function forgotPasswordEmail() {
  /*
   * This will be used in the login screen interface
   * the 'forgot password' link
   */
  try {
    const connection = await pool.getConnection();
    // forgot_password is a BOOlEAN hence true
    // is_deleted is an ENUM hence "false"
    const rows: any = await connection.query(
      `SELECT * FROM users WHERE forgot_password=true AND is_deleted="false";`,
    );
    const forgotPassword = rows[0] as IUser[];

    // if greater then 0 loop thru array
    if (forgotPassword.length > 0) {
      forgotPassword.forEach(async (user) => {
        // compile nunjucks variables&templates
        let data = nunjucksEnv.render(FORGOT_PASSWORD_TEMPLATE, {
          name: user.username,
          resetLink: FORGOT_PASSWORD_LINK,
        });

        // define content to put in mail
        let message: INodemailerMessage = {
          from: process.env.USER_EMAIL,
          to: user.email,
          subject: "Forgot password",
          html: data,
        };

        // send mail
        await sendMail(message);

        // update db to prevent infinite loop
        await connection.query(
          `UPDATE users SET forgot_password=false WHERE id=? AND is_deleted="false";`,
          [user.id],
        );

        // log to files. no console, too much noise, only log to console
        // when complete
        logger.log({
          level: "info",
          status: "success",
          message: `Forgot password email successfully sent out to ${user.id}`,
          data: {
            username: user.username,
            email: user.email,
          },
        });
      });
    } else {
      // log output to console
      console.log({
        status: "success",
        message: "All password change emails have successfully been sent out",
      });
    }
  } catch (error) {
    // log occurrence. not logging to console,as ive already done that in my helper!
    logger.log({
      level: "error",
      message:
        "Internal server error occurred while trying to send password change email.",
      data: { error },
    });
  }
}
