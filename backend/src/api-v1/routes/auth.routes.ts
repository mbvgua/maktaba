import express from "express";

import { loginUser, registerUser } from "../controllers/auth.controllers";

const authRouter = express.Router();

// define all auth routes
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

export default authRouter;
