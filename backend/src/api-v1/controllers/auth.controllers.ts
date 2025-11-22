import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { pool } from "../../config/mysql.config";
import { IUser, UserRole } from "../models/user.models";
import { logger } from "../../config/winston.config";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validators/auth.validators";
import { validationHelper } from "../helpers/validator.helpers";

export async function registerUser(request: Request, response: Response) {
  /*
   * register new user into the system
   */
  const role = UserRole.Student;
  const { username, email, password } = request.body;

  // if validation error exists, exit
  const isValidRequest = await validationHelper(
    request,
    response,
    registerUserSchema,
  );

  try {
    /*
     * NOTE: find out why this logs things onto the console alot?
     * but it works well regardless
     */
    if (isValidRequest) {
      // hash password for security
      const saltRounds = 9;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // save data to db
      const connection = await pool.getConnection();
      await connection.execute(
        `INSERT INTO users(username,email,hashed_password,role) VALUES (?,?,?,?);`,
        [username, email, hashedPassword, role],
      );
      connection.release();

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
  }
}

export async function loginUser(request: Request, response: Response) {
  /*
   * login existing users into the system
   * use expess-session
   * login with either username/email + password
   * include jwt token for use
   */
  const { usernameOrEmail, password } = request.body;

  try {
    const isValidRequest = await validationHelper(
      request,
      response,
      loginUserSchema,
    );

    if (isValidRequest) {
      // get user with either username or email
      const connection = await pool.getConnection();
      const rows: any = await connection.query(
        `SELECT * FROM users WHERE username=? OR email=? AND is_deleted=false;`,
        [usernameOrEmail, usernameOrEmail],
      );
      const user = rows[0] as IUser[];
      connection.release();

      // if user exists
      if (user.length > 0) {
        // compare if passwords match
        const passwordMatch = await bcrypt.compare(
          password,
          user[0].hashed_password,
        );

        // if passwords match
        if (passwordMatch) {
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
            data: {
              user: {
                username: user[0].username,
                email: user[0].email,
                role: user[0].role,
              },
            },
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
  }
}

export function forgotPassword(request: Request, response: Response) {
  /*
   * help user reset forgotten password
   */
}
