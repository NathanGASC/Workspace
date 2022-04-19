import { apiRouter } from './api';
import { createLogger } from '@nathangasc/fox_logger';
import express from 'express';
import loggerConf from "./logger.json"
import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

const logger = createLogger(loggerConf)

export const app = express();
app.use(express.json());
const port = 8080;

app.use("/", express.static(__dirname + "./../client"));
app.use("/api", async (req, res, next) => {
    apiRouter(req, res, next);
})

app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`)
})