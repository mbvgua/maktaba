import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { pool } from "../../config/mysql.config";
import { UserRole } from "../models/user.models";
import { logger } from "../../config/winston.config";
import { registerUserSchema } from "../validators/auth.validators";
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
      const salt_rounds = 9;
      const hashed_password = await bcrypt.hash(password, salt_rounds);

      // save data to db
      const connection = await pool.getConnection();
      await connection.execute(
        `INSERT INTO users(username,email,hashed_password,role) VALUES (?,?,?,?);`,
        [username, email, hashed_password, role],
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
      metadata: null,
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

export function loginUser(request: Request, response: Response) {
  /*
   * login existing users into the system
   */
}

export function forgotPassword(request: Request, response: Response) {
  /*
   * help user reset forgotten password
   */
}
