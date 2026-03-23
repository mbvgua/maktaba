import express from "express";

import {
  loginUser,
  registerUser,
  changePassword,
  deleteUser,
} from "../controllers/auth.controllers";

const authRouter = express.Router();

// define all auth routes
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.patch("/change-password/:id", changePassword);
authRouter.patch("/delete-account/:id", deleteUser);

export default authRouter;
