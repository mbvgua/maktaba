import express from "express";

import {
  forgotPassword,
  loginUser,
  registerUser,
} from "../controllers/auth.controllers";

const authRouter = express.Router();

// define all auth routes
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/forgot-password", forgotPassword);

export default authRouter;
