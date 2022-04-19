const url = new URL(document.location.href);
const splittedUrl = url.pathname.split('/');
const currentEntity = splittedUrl?.at(2);

console.log("UI for entity", currentEntity)

async function start() {
    try {
        fetchAndPushResult();
    } catch (e) {
        console.error("An error occured during api request", e)
    }
}

let fetching = false;
let currentPage = 0;
addEventListener("scroll", async (e) => {
    if (fetching) return;
    if (window.scrollY + window.innerHeight - getScrollLimit() >= -200) {
        try {
            fetching = true;
            await fetchAndPushResult();
            fetching = false;
        } catch (e: any) {
            if (e.message == "response empty") {
                console.log("Page " + currentPage + " empty, stop loading")
            } else {
                throw e;
            }
        }
    }
})

/**
 * fetch until all page are fetched
 * @returns 
 */
async function startFetchQueue() {
    try {
        await fetchAndPushResult()
        startFetchQueue();
    } catch (e: any) {
        if (e.message == "response empty") {
            console.log("Page " + currentPage + " empty, stop loading")
        } else {
            throw e;
        }
    }
    return;
}

async function fetchAndPushResult() {
    console.log("Page " + currentPage + " loading")
    const data = await fetchResult(currentPage)
    pushResult(data);
    console.log("Page " + currentPage + " loaded")
    currentPage++;
}

async function fetchResult(page: number) {
    const res = await fetch("/api/" + currentEntity + "?page=" + page);
    const json = await res.json();
    if (json.length == 0) throw new Error("response empty");
    return json;
}

function pushResult(json: any) {
    const resultsElem = document.querySelector("#results");
    json.forEach((obj: any) => {
        let html = "<div class=obj data-id=" + obj.id + ">"
        for (const key in obj) {
            if (typeof obj[key] != "string" && typeof obj[key] != "number") continue
            const contenteditable = key == "id" ? false : true;
            html += `
            <div class=wrapper>
                <div class=key>${key}</div><div class=value data-original="${obj[key]}" contenteditable="${contenteditable}">${obj[key]}</div>
            </div>
            `
        }
        html += "</div>"

        const element = strToHtml(html)[0];
        const values = element.querySelectorAll(".value");
        values.forEach((value) => {
            value.addEventListener("focusout", onValueFocusOut);
            value.addEventListener("input", onValueInput);
        })
        const keys = element.querySelectorAll(".key");
        keys.forEach((key) => {
            key.addEventListener("click", onKeyClick);
        })

        resultsElem?.append(element);
    });
}

function onValueFocusOut(e: Event) {
    //TODO: update value
    const parent = (e.target as HTMLElement).parentElement;
    const key = parent?.querySelector(".key");
    const id = parent?.parentElement?.dataset.id;
    const newValue = (e.target as HTMLElement).textContent
    console.log("Update key", key?.textContent, "on entity", currentEntity, "with id", id, "with value", newValue);
    (e.target as HTMLElement).innerHTML = (e.target as HTMLElement).textContent || "";

}

function onValueInput(e: Event) {
}

function onKeyClick(e: Event) {
    const valueElem = (e.target as HTMLElement).parentElement?.querySelector(".value") as HTMLElement;
    if (valueElem.contentEditable == "false") return;
    valueElem.textContent = valueElem.dataset.original || "";
    valueElem.dispatchEvent(new InputEvent("focusout"))
}

onDOMReady(start);


/**
 * 
 * 
 * 
 * UTILITIES
 * 
 * 
 */


/**
 * Return a Promise which will finish when the DOM is loaded
 */
function onDOMReady(): Promise<void>;
/**
  * Trigger callback when the DOM is ready
  * @param callback 
  */
function onDOMReady(callback: () => void): void;
function onDOMReady(callback?: () => void): void | Promise<void> {
    if (callback) {
        const id = setInterval(() => {
            if (document.readyState == "complete") {
                callback();
                clearInterval(id);
            }
        }, 100)
    } else {
        return new Promise((resolve, reject) => {
            const id = setInterval(() => {
                if (document.readyState == "complete") {
                    resolve();
                    clearInterval(id);
                }
            }, 100)
        })
    }
}

/**
 * Transform a string to HTML
 * @param htmlString html to transform
 * @returns an array of HTMLElement which are the equivalant of your string
 */
function strToHtml(htmlString: string) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return Array.from(div.children);
}

function getScrollLimit() {
    return Math.max(document.body.scrollHeight, document.body.offsetHeight,
        document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
}