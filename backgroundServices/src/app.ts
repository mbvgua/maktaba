import express from "express";

const app = express();

// set app middleware
app.use(express.json());

export default app;
