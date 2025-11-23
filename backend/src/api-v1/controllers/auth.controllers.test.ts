import supertest from "supertest";
import bcrypt from "bcrypt";

import app from "./../../app";
import { pool } from "../../config/mysql.config";
import { UserRole } from "../models/user.models";

const request = supertest(app);
let newUser = {
  username: "merlin",
  email: "merlin@gmail.com",
  password: "@Merlin25",
};

let existingUser = {
  username: "maximus",
  email: "maximus@gmail.com",
  password: "@Maximus25",
};

let nonExistingUser = {
  username: "minimus",
  email: "minimus@gmail.com",
  password: "@Minimus25",
};

let incorrectUserDetails = {
  username: "@percy",
  password: "percy1234",
};

// create dummy users in db
beforeAll(async () => {
  const password = existingUser.password;
  const saltRounds = 9;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const connection = await pool.getConnection();
  await connection.query(
    "INSERT INTO users(username,email,hashed_password,role) VALUES(?,?,?,?);",
    [existingUser.username, existingUser.email, hashedPassword, UserRole.Admin],
  );
});

afterAll(async () => {
  const connection = await pool.getConnection();
  await connection.query("DELETE FROM users WHERE username=?", [
    existingUser.username,
  ]);
  await connection.query("DELETE FROM users WHERE username=?", [
    newUser.username,
  ]);
  await connection.query("DELETE FROM users WHERE email=?", [newUser.email]);
});

describe("[auth tests]", () => {
  describe("POST /v1/auth/register", () => {
    it("should successfully register new users", async () => {
      const response = await request.post("/v1/auth/register").send(newUser);

      expect(response.statusCode).toBe(201);
      expect(response.body).toBeDefined();
      expect(response.body.status).toMatch("success");
      expect(response.body.message).toMatch(
        `Congratulations ${newUser.username}! You have succesfully created a new account.`,
      );
      expect(response.body.data.user).toHaveProperty(
        "username",
        newUser.username,
      );
      expect(response.body.data.user).toHaveProperty("email", newUser.email);
      expect(response.body.metadata).toBeNull();
    });

    it("should return error for already existing user", async () => {
      const response = await request
        .post("/v1/auth/register")
        .send(existingUser);

      expect(response.statusCode).toBe(500);
      expect(response.body).toBeDefined();
      expect(response.body.status).toMatch("error");
      expect(response.body.message).toMatch("Internal server error");
      expect(response.body.data.error).toHaveProperty(
        "message",
        `Duplicate entry '${existingUser.username}' for key 'users.username'`,
      );
      expect(response.body.data.error).toHaveProperty("errno", 1062);
      expect(response.body.data.metadata).toBeUndefined();
    });

    describe("* validation errors:", () => {
      it("incorrect username validation error", async () => {
        newUser.username = ".";

        const response = await request.post("/v1/auth/register").send(newUser);

        expect(response.statusCode).toBe(422);
        expect(response.body).toBeDefined();
        expect(response.body.status).toMatch("error");
        expect(response.body.message).toMatch(
          "An error occurred while validating the request schema",
        );
        expect(response.body.data).toHaveProperty(
          "error",
          "username can only contain letters(a-z) and digits(0-9)",
        );
        expect(response.body.data.metadata).toBeUndefined();
      });

      it("incorrect email validation error", async () => {
        // return username to one that is valid
        newUser.username = "merlin";
        newUser.email = "merlin@gmail.com.ke.zim";

        const response = await request.post("/v1/auth/register").send(newUser);

        expect(response.statusCode).toBe(422);
        expect(response.body).toBeDefined();
        expect(response.body.status).toMatch("error");
        expect(response.body.message).toMatch(
          "An error occurred while validating the request schema",
        );
        expect(response.body.data).toHaveProperty(
          "error",
          "email can only have two domains, e.g 'example.com' whose suffix can only be either '.com' or '.net'",
        );
        expect(response.body.data.metadata).toBeUndefined();
      });

      it("incorrect password validation error", async () => {
        // return email to one that is valid
        newUser.email = "merlin@gmail.com";
        newUser.password = "@Merlin";

        const response = await request.post("/v1/auth/register").send(newUser);

        expect(response.statusCode).toBe(422);
        expect(response.body).toBeDefined();
        expect(response.body.status).toMatch("error");
        expect(response.body.message).toMatch(
          "An error occurred while validating the request schema",
        );
        expect(response.body.data).toHaveProperty(
          "error",
          "Password must contain atleast one lowercase letter,one uppercase letter, one digit and one special character",
        );
        expect(response.body.data.metadata).toBeUndefined();
      });
    });
  });

  describe("POST /v1/auth/login", () => {
    // already existinf user
    const loginUser = {
      usernameOrEmail: "maximus",
      password: "@Maximus25",
    };
    // non existent user
    it("should successfully login existing users with username", async () => {
      const response = await request.post("/v1/auth/login").send({
        usernameOrEmail: existingUser.username,
        password: existingUser.password,
      });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toBeDefined();
      expect(response.body.code).toEqual(200);
      expect(response.body.status).toMatch("success");
      expect(response.body.message).toMatch(
        `Congratulations ${loginUser.usernameOrEmail}! You have successfully logged in.`,
      );
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.metadata).toBeNull();
    });

    it("should successfully login existing users with email", async () => {
      const response = await request.post("/v1/auth/login").send({
        usernameOrEmail: existingUser.email,
        password: existingUser.password,
      });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toBeDefined();
      expect(response.body.code).toEqual(200);
      expect(response.body.status).toMatch("success");
      expect(response.body.message).toMatch(
        `Congratulations ${loginUser.usernameOrEmail}! You have successfully logged in.`,
      );
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.metadata).toBeNull();
    });

    it("should return error for non existent users", async () => {
      const response = await request.post("/v1/auth/login").send({
        usernameOrEmail: nonExistingUser.username,
        password: nonExistingUser.password,
      });

      expect(response.body).toBeDefined();
      expect(response.body.status).toMatch("error");
      expect(response.body.message).toMatch(
        "User does not exist. Try creating an account instead?",
      );
      expect(response.body.data.user).toHaveProperty(
        "usernameOrEmail",
        nonExistingUser.username,
      );
      expect(response.body.metadata).toBeNull();
    });

    it("should return error for password mismatch", async () => {
      const response = await request.post("/v1/auth/login").send({
        usernameOrEmail: existingUser.username,
        password: nonExistingUser.password,
      });

      expect(response.statusCode).toBe(403);
      expect(response.body).toBeDefined();
      expect(response.body.status).toMatch("error");
      expect(response.body.message).toMatch(
        "Oops! Looks like the passwords do not match, try again?",
      );
      expect(response.body.data.user).toHaveProperty(
        "username",
        existingUser.username,
      );
      expect(response.body.metadata).toBeNull();
    });

    describe("* validation errors:", () => {
      /*
       * NOTE: no validation rules for usernameOrEmail in login,
       * only that it has to be a string. Hence it relies on rules
       * in registerSchema. If invalid, user cannot exist thus will
       * return 'user does not exists error'
       */
      it("incorrect usernameOrEmail validation", async () => {
        const response = await request.post("/v1/auth/login").send({
          usernameOrEmail: incorrectUserDetails.username,
          password: existingUser.password,
        });

        expect(response.statusCode).toBe(404);
        expect(response.body).toBeDefined();
        expect(response.body.status).toMatch("error");
        expect(response.body.message).toMatch(
          "User does not exist. Try creating an account instead?",
        );
        expect(response.body.data.user).toHaveProperty(
          "usernameOrEmail",
          incorrectUserDetails.username,
        );
        expect(response.body.metadata).toBeNull();
      });

      it("incorrect password validation", async () => {
        const response = await request.post("/v1/auth/login").send({
          usernameOrEmail: existingUser.username,
          password: incorrectUserDetails.password,
        });

        expect(response.statusCode).toBe(422);
        expect(response.body).toBeDefined();
        expect(response.body.status).toMatch("error");
        expect(response.body.message).toMatch(
          "An error occurred while validating the request schema",
        );
        expect(response.body.data.path).toEqual(["password"]);

        expect(response.body.data).toHaveProperty(
          "error",
          "Password must contain atleast one lowercase letter,one uppercase letter, one digit and one special character",
        );
        expect(response.body.metadata).toBeNull();
      });
    });
  });
});
