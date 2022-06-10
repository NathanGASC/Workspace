import { createLogger } from "@nathangasc/fox_logger";
import { componentsInit } from "./components/components";
import logConfig from "./logger.json";

export const logger = createLogger(logConfig);

logger.default.log("Hello world from default");

componentsInit();