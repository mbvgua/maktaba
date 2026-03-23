import dotenvx from "@dotenvx/dotenvx";
import path from "path";

import { pool } from "../../config/mysql.config";
import { nunjucksEnv } from "../../config/nunjucks.config";
import { logger } from "../../config/winston.config";
import { sendMail } from "../helpers/send-email.helper";
import { INodemailerMessage } from "../models/nodemailer.models";
import { IUser } from "../models/user.models";

dotenvx.config({ path: path.resolve(__dirname, "../../../.env") });
const GOODBYE_TEMPLATE = "goodbye-email.html";

export async function sendGoodbyeEmail() {
  /*
   * sends goodbye email to user after they click delete
   * then soft deletes it. but hard delete after 7 days if not restored
   */
  const connection = await pool.getConnection();

  try {
    const rows: any = await connection.query(
      `SELECT * FROM users WHERE is_deleted="pending";`,
    );
    const users = rows[0] as IUser[];

    if (users.length > 0) {
      users.forEach(async (user) => {
        //compile template
        const data = nunjucksEnv.render(GOODBYE_TEMPLATE, {
          name: user.username,
        });

        // define email content
        const message: INodemailerMessage = {
          from: process.env.USER_EMAIL,
          to: user.email,
          subject: "This is Goodbye",
          html: data,
        };

        // send mail
        await sendMail(message);

        // update db to prevent infinte loop
        await connection.execute(
          `UPDATE users SET is_deleted="true" WHERE id=?;`,
          [user.id],
        );

        // log occurence to files only
        logger.log({
          level: "info",
          message: `User ${user.username} of id:${user.id} has successfully deleted their account.`,
          data: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        });
      });
    }
    // if no users to send email to
    console.log({
      status: "success",
      message: "All goodbye emails sent successfully",
    });
  } catch (error) {
    //log occurrence to log files only. reduce noise!!
    logger.log({
      level: "error",
      message: "Internal server error occurred while sending goodbye email",
      data: { error },
    });
  } finally {
    connection.release();
  }
}
