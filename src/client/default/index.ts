import { createLogger } from "@nathangasc/fox_logger";
import { json } from "stream/consumers";
import { componentsInit } from "./components/components";
import { Component } from "./components/tools";
import { loremIpsum } from "./helpers/any";
import { onDOMReady } from "./helpers/DOM";
import logConfig from "./logger.json";

//We create logger from our configuration
export const logger = createLogger(logConfig);

//We init ur components (we pass ur logger which is used by ur components to logs. That's why configuration should have a namespace foreach components)
componentsInit(logger, {
    "logActiveComponents":true,
    "logComponentsComment": true,
    "warnMissingListenerFunction": true,
    "logCalledListenerFunction": true
});

(async () => {
    //We wait page end loading
    await onDOMReady()
    const textCascade = document.querySelector("www-text-cascade");
    const twodTable = document.querySelector("www-twod-table");
    const btnList = document.querySelector("www-btn-list");
    
    btnList?.attachListener((item)=>{
        //Do something when item is clicked
        switch (item) {
            case "Play":
                textCascade?.play()
                break;
            case "Pause":
                textCascade?.pause()
                break;
            case "Reset":
                textCascade?.setAttribute("text",loremIpsum(500))
                updateObjectTable()
                break;
            default:
                break;
        }
    })

    textCascade?.setAttribute("text",loremIpsum(500))
    updateObjectTable()

    
    const observedElement = textCascade!.shadowRoot!;
    const mutationObserver = new MutationObserver(updateObjectTable);
    mutationObserver.observe(observedElement, {"subtree": true, "childList":true, "characterData":true})

    function updateObjectTable(){
        const text = textCascade?.shadowRoot?.textContent
        const aText = text?.split(" ");
        const jsonObject:(string|number)[][] = [
            ["words", "occurences"]
        ]

        aText?.forEach(word => {
            const existIndex = jsonObject.findIndex((t)=>{return t[0] == word})
            if(existIndex != -1) {
                jsonObject[existIndex] = [word, (jsonObject[existIndex][1] as number)+1]
            }
            else{
                jsonObject.push([word, 1])
            }
        });

        twodTable?.setAttribute("object", JSON.stringify(jsonObject))
    }
})()