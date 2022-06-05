//IMPORTANT: Even if your CLIENT env variable is set to "hello", this script will never be used. You can overwrite ressources files like HTML, CSS, images, ... but
//not typescript files. 

// reason: Typescript use type so you can't overwrite files without generating type error (in most case). For example if my script a.ts export helloWorld function which is
// used somewhere and my other a.ts which will overwrite the first one don't export helloWorld, typescript will display an error on compilation. Also, import path will be
// broken.

import { createLogger } from "@nathangasc/fox_logger";
import logConfig from "./../default/logger.json";

export const logger = createLogger(logConfig);

logger.default.log("Hello world from hello");