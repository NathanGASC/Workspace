import { createLogger } from "@nathangasc/fox_logger";
import { componentsInit } from "./components/components";
import { loremIpsum } from "./helpers/any";
import { onDOMReady } from "./helpers/DOM";
import logConfig from "./logger.json";

//We create logger from our configuration
export const logger = createLogger(logConfig);

//We init ur components
componentsInit({ 
    "namespaces": { 
        "default": { 
            "isLogged": true
        } 
    },
    "options":{
        "format": "",
        "isLogged":{
            "debug": true,
            "error": true,
            "info": true,
            "log": true,
            "warn": true,
        }
    }
}, {
    "logActiveComponents": true,
    "logCalledListenerFunction": true,
    "logComponentsComment": true,
    "logDependenciesCustomElement": true,
    "warnMissingListenerFunction": true
});

(async () => {
    //We wait page end loading
    await onDOMReady()
    const textCascade = document.querySelector("www-text-cascade");
    const paginableTable = document.querySelector("www-paginable-table");
    const btnLists = document.querySelectorAll("www-btn-list");

    btnLists[0]?.attachListener((item) => {
        //Do something when item is clicked. Item have the text value of the clicked button
        switch (item) {
            case "Play":
                textCascade?.play()
                break;
            case "Pause":
                textCascade?.pause()
                break;
            case "Reset":
                //we generate a new text
                textCascade?.setAttribute("text", loremIpsum(500))
                paginableTable?.setAttribute("page", "0")
                updateObjectTable()
                break;
            default:
                break;
        }
    })

    btnLists[1]?.attachListener((item) => {
        //Do something when item is clicked. Item have the text value of the clicked button
        switch (item) {
            case "Next":
                paginableTable?.next();
                break;
            case "Previous":
                paginableTable?.previous();
                break;
            default:
                break;
        }
    })

    textCascade?.setAttribute("text", loremIpsum(500))
    updateObjectTable()

    //we observe ur text and call update table each time the DOM change (for example adding a letter will trigger the function)
    const observedElement = textCascade!.shadowRoot!;
    const mutationObserver = new MutationObserver(updateObjectTable);
    mutationObserver.observe(observedElement, { "subtree": true, "childList": true, "characterData": true })

    //Transform the text in a 3D table and put it in paginableTable element's object attribute
    function updateObjectTable() {
        //Transform the text in a 3D table with words & occurences. (3D because the table have pagination)
        const text = textCascade?.shadowRoot?.textContent
        const aText = text?.split(" ");
        const jsonObject: (string | number)[][][] = [
            [
                ["words", "occurences"]
            ]
        ]

        aText?.forEach(word => {
            let pageIndex = -1;
            let wordIndex = -1;
            jsonObject.forEach((page, i) => {
                wordIndex = page.findIndex((row) => { return row[0] == word })
                if (wordIndex != -1) {
                    pageIndex = i;
                }
            })

            if (wordIndex != -1) {
                jsonObject[pageIndex][wordIndex] = [word, (jsonObject[pageIndex][wordIndex][1] as number) + 1]
            }
            else {
                if (jsonObject[jsonObject.length - 1].length == 10) {
                    jsonObject[jsonObject.length] = [
                        ["words", "occurences"]
                    ];
                }
                jsonObject[jsonObject.length - 1].push([word, 1])
            }
        });

        //Asign the 2D table to ur twodTable element
        paginableTable?.setAttribute("object", JSON.stringify(jsonObject))
    }
})()