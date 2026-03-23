import express from "express";

import {
  loginUser,
  registerUser,
  changePassword,
} from "../controllers/auth.controllers";

const authRouter = express.Router();

// define all auth routes
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/change-password/:id", changePassword);

export default authRouter;
