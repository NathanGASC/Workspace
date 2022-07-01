import { createLogger } from "@nathangasc/fox_logger";
import { componentsInit } from "./components/components";
import { onDOMReady } from "./helpers/DOM";
import logConfig from "./logger.json";

//We create logger from our configuration
export const logger = createLogger(logConfig);

//We init ur components (we pass ur logger which is used by ur components to logs. That's why configuration should have a namespace foreach components)
componentsInit(logger);

//Here an example of logging using default namespace. Look at the console to see the result
logger.default.log("Hello world from default");

(async () => {
    //We wait page end loading
    await onDOMReady()

    //Page is ready, we can fetch ur word counter component in the page and use count function which is a custom function that isn't exist on basic html element
    const counter = document.querySelector("www-word-counter");
    const count = counter?.count()

    logger.default.log("The count is:", count);

    //each 10ms we add a word to ur text (which isn't displayed in the page yet)
    let allText = ""
    setInterval(() => {
        const words = `Lorem ipsum dolor sit amet. Ut dolore veritatis ea nulla eaque et nostrum sint sed libero harum aut officia autem. Qui officiis modi sed galisum dignissimos aut consectetur magnam in unde sint et galisum veniam aut corporis iure et nisi sequi. Aut consectetur incidunt in velit temporibus et perferendis possimus eos voluptatem numquam et consequatur voluptates cum molestias magni est amet saepe. Provident internos aut repellendus autem est galisum accusantium et voluptatibus quod. Qui voluptatem optio ut quaerat maiores eos odio cupiditate ut saepe dolorem qui galisum iure nam maxime reiciendis ut doloribus necessitatibus. A aspernatur natus qui rerum deleniti non velit dolores ea rerum animi est facere suscipit et accusamus consequatur non provident porro. Ut possimus dolorem et placeat necessitatibus nam quis cupiditate ut mollitia facere aut voluptas maiores.`
        const aWords = words.split(" ")
        const word = aWords[Math.floor(Math.random() * aWords.length)]
        allText += " " + word
    }, 10)

    //each 10ms we display the next letter from the text (word counter is "watching" the element and will update his count on element content update)
    let currentIndex = 0
    const element = document.querySelector("#hello") as HTMLElement;
    setInterval(() => {
        const character = allText[currentIndex]
        element.textContent = element.textContent + character
        currentIndex++
    }, 10)
})()
