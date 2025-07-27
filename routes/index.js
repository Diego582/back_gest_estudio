import express from "express";
import clientsRouter from "./client.js"


const router = express.Router();

router.use("/clients", clientsRouter);

export default router;