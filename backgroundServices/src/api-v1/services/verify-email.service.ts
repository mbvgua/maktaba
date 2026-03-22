import path from "path";
import dotenvx from "@dotenvx/dotenvx";

import { pool } from "../../config/mysql.config";
import { IUser } from "../models/user.models";
import { sendMail } from "../helpers/send-email.helper";
import { INodemailerMessage } from "../models/nodemailer.models";
import { logger } from "../../config/winston.config";
import { nunjucksEnv } from "../../config/nunjucks.config";

dotenvx.config();
const VERIFICATION_TEMPLATE = "verify-email.html"
const VERIFICATION_LINK = "http://localhost:4000/v1/auth/verify-email";

export async function sendVerifyEmail() {
  try {
    // get unverified users from db
    // NOTE: is_verified and is_deleted are both ENUM() type hence need to be in ""
    const connection = await pool.getConnection();
    const rows: any = await connection.query(
      `SELECT * FROM users where is_verified="false" AND is_deleted="false";`,
    );
    const verificationEmailPending = rows[0] as IUser[];

    //loop through users sending verification link
    if (verificationEmailPending.length > 0) {
      verificationEmailPending.forEach(async (user) => {
        // define mail content
        const data = nunjucksEnv.render(VERIFICATION_TEMPLATE, {
          name: user.username,
          verifyLink: VERIFICATION_LINK,
        });

        // content to place in email
        let message: INodemailerMessage = {
          from: process.env.USER_EMAIL,
          to: user.email,
          subject: "Verify email",
          html: data,
        };

        //send mail
        await sendMail(message);

        // update db to pending to prevent infinite loop
        await connection.query(
          `UPDATE users SET is_verified="pending" WHERE id=?;`,
          [user.id],
        );
        connection.release();

        // log occurrence
        logger.log({
          level: "info",
          message: `Verification email successfully sent out to ${user.id}.`,
          data: {
            username: user.username,
            email: user.email,
          },
        });
      });
    } else {
      // if no unverified users, display that to console
      console.log({
        status: "success",
        message: "All verification emails have successfully been sent out",
      });
    }
  } catch (error) {
    // log occurrence. not logging to console,as ive already done that in my helper!
    logger.log({
      level: "error",
      message:
        "Internal server error occurred while trying to send verification email.",
      data: { error },
    });
  }
}
