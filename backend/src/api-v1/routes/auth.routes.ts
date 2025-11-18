import express from "express";

import { registerUser } from "../controllers/auth.controllers";

const authRouter = express.Router();

// define all auth routes
authRouter.post("/register", registerUser);

export default authRouter;
