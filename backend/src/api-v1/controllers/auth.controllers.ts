import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenvx from "@dotenvx/dotenvx";

import { pool } from "../../config/mysql.config";
import { IPayload, IUser, UserRole } from "../models/user.models";
import { logger } from "../../config/winston.config";
import {
  changePasswordSchema,
  loginUserSchema,
  registerUserSchema,
} from "../validators/auth.validators";
import { validationHelper } from "../helpers/validator.helpers";

dotenvx.config();
const SALT_ROUNDS = 9;
const JWT_EXPIRATION = "7 days";

export async function registerUser(request: Request, response: Response) {
  /*
   * register new user into the system
   * requires username,email,password from user. rest are filled gradually
   */
  const role = UserRole.Student;
  const { username, email, password } = request.body;

  // if validation error exists, exit
  const isValidRequest = await validationHelper(
    request,
    response,
    registerUserSchema,
  );

  // create connection pool
  const connection = await pool.getConnection();

  try {
    /*
     * NOTE: find out why this logs things onto the console alot?
     * but it works well regardless
     */
    if (isValidRequest) {
      // hash password for security
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // save data to db
      await connection.execute(
        `INSERT INTO users(username,email,hashed_password,role) VALUES (?,?,?,?);`,
        [username, email, hashedPassword, role],
      );

      //log the occurrence
      logger.log({
        level: "info",
        message: `${username} has succesfully created a new account`,
        data: {
          user: {
            username,
            email,
            role,
          },
        },
      });

      // return needed response
      return response.status(201).json({
        code: 201,
        status: "success",
        message: `Congratulations ${username}! You have succesfully created a new account.`,
        data: {
          user: {
            username,
            email,
            role,
          },
        },
        metadata: null,
      });
    }
  } catch (error) {
    // log the occurrence
    logger.log({
      level: "error",
      message: `Internal server error occurred while ${username} was creating an account!`,
      data: { error },
    });

    // return error codes
    return response.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error occurred",
      data: { error },
      metadata: null,
    });
  } finally {
    //release connection pool
    connection.release();
  }
}

export async function loginUser(request: Request, response: Response) {
  /*
   * login existing users into the system
   * login with either username/email + password
   * include jwt token for use
   * TODO: use express-session
   */
  const { usernameOrEmail, password } = request.body;

  // create connection pool
  const connection = await pool.getConnection();

  try {
    const isValidRequest = await validationHelper(
      request,
      response,
      loginUserSchema,
    );

    if (isValidRequest) {
      //NOTE: is_deletedis NOT a boolean val but an enum hence ""
      // get user with either username or email
      const rows: any = await connection.query(
        `SELECT * FROM users WHERE username=? OR email=? AND is_deleted="false";`,
        [usernameOrEmail, usernameOrEmail],
      );
      const user = rows[0] as IUser[];

      // if user exists
      if (user.length > 0) {
        // compare if passwords match
        const passwordMatch = await bcrypt.compare(
          password,
          user[0].hashed_password,
        );

        // if passwords match
        if (passwordMatch) {
          // define the payload
          const payload: IPayload = {
            id: user[0].id,
            username: user[0].username,
            email: user[0].email,
            role: user[0].role,
          };

          // assign the jsonweb token
          const token = jwt.sign(payload, process.env.SECRET_KEY as string, {
            expiresIn: JWT_EXPIRATION,
          });

          // log occurrence
          logger.log({
            level: "info",
            message: `${usernameOrEmail} has successfully logged in`,
            data: {
              user: {
                username: user[0].username,
                email: user[0].email,
              },
            },
          });

          // return response
          return response.status(200).json({
            code: 200,
            status: "success",
            message: `Congratulations ${user[0].username}! You have successfully logged in.`,
            data: { token },
            metadata: null,
          });
        }
        // else if they dont match
        logger.log({
          level: "error",
          message: `User of id: ${user[0].id} tried to login but used incorrect password.`,
          data: {
            user: {
              username: user[0].username,
              email: user[0].email,
            },
          },
        });

        return response.status(403).json({
          code: 403,
          status: "error",
          message: "Oops! Looks like the passwords do not match, try again?",
          data: {
            user: {
              username: user[0].username,
            },
          },
          metadata: null,
        });
      }
      // else if not found
      logger.log({
        level: "error",
        message: `Username/email: ${usernameOrEmail} tried to login but their account does not exist.`,
        data: {
          user: {
            usernameOrEmail,
          },
        },
      });

      return response.status(404).json({
        code: 404,
        status: "error",
        message: "User does not exist. Try creating an account instead?",
        data: {
          user: {
            usernameOrEmail,
          },
        },
        metadata: null,
      });
    }
  } catch (error) {
    // log occurence
    logger.log({
      level: "info",
      message: `Internal server error occurred while ${usernameOrEmail} was creating an account!`,
      data: { error },
    });

    // return error
    return response.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error occurred",
      data: { error },
      metadata: null,
    });
  } finally {
    //release connection pool
    connection.release();
  }
}

export async function changePassword(
  request: Request<{ id: string }>,
  response: Response,
) {
  /*
   * user reset passoword. accessed directly in logged in UI
   * if not logged in, the user will click on the 'forgot password' link
   * that initiates a background service that sends you a link to this endpoint in your email
   * in login screen to access this endpoint
   */
  const user_id = request.params.id;
  const { newPassword } = request.body;

  // ensure new_password ihas no validation erro
  const isValidRequest = await validationHelper(
    request,
    response,
    changePasswordSchema,
  );

  // create connection pool
  const connection = await pool.getConnection();

  try {
    //get user based on their id
    const rows: any = await connection.query(
      `SELECT * FROM users WHERE id=? AND is_deleted="false";`,
      [user_id],
    );
    const user = rows[0] as IUser[];

    //if present, hash password, then change to new one in db
    if (user.length > 0) {
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
      await connection.execute(
        `UPDATE users SET hashed_password=? WHERE id=? AND is_deleted="false";`,
        [hashedPassword, user[0].id],
      );

      // log occurence & return response
      logger.log({
        level: "info",
        message: `User ${user[0].username} of id:${user[0].id} successfully changed their password`,
        data: {
          user_id: user[0].id,
          username: user[0].username,
          email: user[0].email,
        },
      });

      return response.status(201).json({
        code: 201,
        status: "success",
        message: `Congratulations ${user[0].username}, you have successfully changed your password`,
        data: {
          user_id: user[0].id,
          username: user[0].username,
          email: user[0].email,
        },
        metadata: null,
      });
    }
    //if not found terminate execution with appropriate response
    //log info to files and return appropriate error response
    logger.log({
      level: "error",
      message: `No user of id ${user_id} exists, but they tried changing their password`,
      data: { user_id: user_id },
    });

    return response.status(404).json({
      code: 404,
      status: "error",
      message: `User of id:${user_id} was not found. Create an account first?`,
      data: { user_id: user_id },
      metadata: null,
    });
  } catch (error) {
    // log occurrence in logs
    logger.log({
      level: "error",
      message: `Internal server error occurred while ${user_id} was updating their password`,
      data: { error },
    });

    // return error response
    return response.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error occurred",
      data: { error },
      metadata: null,
    });
  } finally {
    //release connection pool
    connection.release();
  }
}

export async function deleteUser(
  request: Request<{ id: string }>,
  response: Response,
) {
  /*
   * delete user account
   */

  const user_id = request.params.id;
  const connection = await pool.getConnection();

  try {
    // get user from db based on id
    const rows: any = await connection.query(
      `SELECT * FROM users WHERE id=? AND is_deleted="false"`,
      [user_id],
    );
    const user = rows[0] as IUser[];

    // if user exists, delete that
    if (user.length > 0) {
      await connection.execute(
        `UPDATE users SET is_deleted="pending" WHERE id=?;`,
        [user[0].id],
      );

      logger.log({
        level: "info",
        message: `User ${user[0].username} of id: ${user[0].id} has deleted there account`,
        data: {
          id: user[0].id,
          username: user[0].username,
          email: user[0].email,
        },
      });

      return response.status(201).json({
        status: "success",
        code: 201,
        message: `Oh no! ${user[0].username}, you have deleted you account`,
        data: {
          username: user[0].username,
          email: user[0].email,
        },
        metadata: null,
      });
    }
    // else return appropriate erroe messages
    logger.log({
      level: "error",
      message: `${user_id} tried deleteing their account, but it does not exist`,
      data: { user_id: user_id },
    });

    return response.status(404).json({
      code: 404,
      status: "error",
      message: "Oops! Looks like their is no user account linked to that id. Try again?",
      data: {
        user_id: user_id,
      },
      metadata: null,
    });
  } catch (error) {
    logger.log({
      level: "error",
      message: "Internal server error occurred while deleting user account",
      data: { error },
    });

    return response.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error occurred",
      data: { error },
      metadata: null,
    });
  } finally {
    connection.release();
  }
}
