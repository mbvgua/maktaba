import supertest from "supertest";
import bcrypt from "bcrypt";

import app from "./../../app";
import { pool } from "../../config/mysql.config";
import { UserRole } from "../models/user.models";

const request = supertest(app);
let dummyUser = {
  username: "merlin",
  email: "merlin@gmail.com",
  password: "@Merlin25",
};

// create dummy users in db
beforeAll(async () => {
  const password = "@Maximus25";
  const salt_rounds = 9;
  const hashed_password = await bcrypt.hash(password, salt_rounds);

  const connection = await pool.getConnection();
  await connection.query(
    "INSERT INTO users(username,email,hashed_password,role) VALUES(?,?,?,?);",
    ["maximus", "maximus@gmail.com", hashed_password, UserRole.Admin],
  );
});

afterAll(async () => {
  const connection = await pool.getConnection();
  await connection.query("DELETE FROM users WHERE username=?", ["maximus"]);
  await connection.query("DELETE FROM users WHERE username=?", ["merlin"]);
  await connection.query("DELETE FROM users WHERE email=?", [
    "merlin@gmail.com",
  ]);
});

describe("[auth tests]", () => {
  describe("* registerUser endpoint", () => {
    it("should successfully register new users", async () => {
      const user = {
        username: "merlin",
        email: "merlin@gmail.com",
        password: "@Merlin25",
      };
      const response = await request.post("/v1/auth/register").send(user);

      expect(response.statusCode).toBe(201);
      expect(response.body).toBeDefined();
      expect(response.body.status).toMatch("success");
      expect(response.body.message).toMatch(
        `Congratulations ${dummyUser.username}! You have succesfully created a new account.`,
      );
      expect(response.body.data.user).toHaveProperty(
        "username",
        dummyUser.username,
      );
      expect(response.body.data.user).toHaveProperty("email", dummyUser.email);
    });

    it("should return error for already existing user", async () => {
      const dummyUser = {
        username: "maximus",
        email: "maximus@gmail.com",
        password: "@Maximus25",
      };

      const response = await request.post("/v1/auth/register").send(dummyUser);

      expect(response.statusCode).toBe(500);
      expect(response.body).toBeDefined();
      expect(response.body.status).toMatch("error");
      expect(response.body.message).toMatch("Internal server error");
      expect(response.body.data.error).toHaveProperty(
        "message",
        `Duplicate entry '${dummyUser.username}' for key 'users.username'`,
      );
      expect(response.body.data.error).toHaveProperty("errno", 1062);
      expect(response.body.data.metadata).toBeUndefined();
    });

    describe("- validation errors:", () => {
      it("incorrect username validation error", async () => {
        dummyUser.username = ".";

        const response = await request
          .post("/v1/auth/register")
          .send(dummyUser);

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
        dummyUser.username = "merlin";
        dummyUser.email = "merlin@gmail.com.ke.zim";

        const response = await request
          .post("/v1/auth/register")
          .send(dummyUser);

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
        dummyUser.email = "merlin@gmail.com";
        dummyUser.password = "@Merlin";

        const response = await request
          .post("/v1/auth/register")
          .send(dummyUser);

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
});
