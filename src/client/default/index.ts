import { createLogger } from "@nathangasc/fox_logger";
import { componentsInit } from "./components/components";
import { WordCounter } from "./components/workspace/wordCounter";
import { onDOMReady } from "./helpers/DOM";
import logConfig from "./logger.json";
import lorem from "lorem-ipsum"

componentsInit();

export const logger = createLogger(logConfig);

logger.default.log("Hello world from default");

(async ()=>{
    await onDOMReady()
    const counter = document.querySelector("www-word-counter") as WordCounter;
    const count = counter.count()
    
    logger.default.log("The count is:", count);

    let allText = ""
    setInterval(()=>{
        const words = `Lorem ipsum dolor sit amet. Ut dolore veritatis ea nulla eaque et nostrum sint sed libero harum aut officia autem. Qui officiis modi sed galisum dignissimos aut consectetur magnam in unde sint et galisum veniam aut corporis iure et nisi sequi. Aut consectetur incidunt in velit temporibus et perferendis possimus eos voluptatem numquam et consequatur voluptates cum molestias magni est amet saepe. Provident internos aut repellendus autem est galisum accusantium et voluptatibus quod. Qui voluptatem optio ut quaerat maiores eos odio cupiditate ut saepe dolorem qui galisum iure nam maxime reiciendis ut doloribus necessitatibus. A aspernatur natus qui rerum deleniti non velit dolores ea rerum animi est facere suscipit et accusamus consequatur non provident porro. Ut possimus dolorem et placeat necessitatibus nam quis cupiditate ut mollitia facere aut voluptas maiores.`
        const aWords = words.split(" ")
        const word = aWords[Math.floor(Math.random() * aWords.length)]
        allText += " " + word
    }, 100)

    let currentIndex = 0
    const element = document.querySelector("#hello") as HTMLElement;
    setInterval(()=>{
        const character = allText[currentIndex]
        element.textContent = element.textContent + character
        currentIndex++
    },100)
})()
