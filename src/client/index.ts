import { createLogger } from "@nathangasc/fox_logger";
import logConfig from "./logger.json";

export const logger = createLogger(logConfig);

logger.default.log("Hello world");