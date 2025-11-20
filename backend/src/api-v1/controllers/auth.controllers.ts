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
  const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

  try {
    // deal with email
    if (emailRegex.test(usernameOrEmail)) {
      const isValidRequest = await validationHelper(
        request,
        response,
        loginUserSchema,
      );

      if (isValidRequest) {
        // make connection to db and get user
        const connection = await pool.getConnection();
        const rows: any = await connection.query(
          "SELECT * FROM users WHERE email=? AND is_deleted=false",
          [usernameOrEmail],
        );
        const user = rows[0] as IUser[];
        connection.release();

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
          message: `An error occurred while user of id: ${user[0].id} was loggin in.`,
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
    }
    // else deal with username
    const isValidRequest = await validationHelper(
      request,
      response,
      loginUserSchema,
    );

    if (isValidRequest) {
      // make connection to db and get user
      const connection = await pool.getConnection();
      const rows: any = await connection.query(
        "SELECT * FROM users WHERE username=? AND is_deleted=false",
        [usernameOrEmail],
      );
      const user = rows[0] as IUser[];
      connection.release();

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
        message: `An error occurred while user of id: ${user[0].id} was loggin in.`,
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
