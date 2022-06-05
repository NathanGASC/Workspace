import { createLogger } from "@nathangasc/fox_logger";
import logConfig from "./../default/logger.json";

export const logger = createLogger(logConfig);

logger.default.log("Hello world from hello");