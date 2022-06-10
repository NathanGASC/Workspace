import { capitalizeFirstLetter } from '../../helpers/any';
import { strToHtml } from '../../helpers/DOM';
import view from "./assets/wordCounter/index.html";
import css from "./assets/wordCounter/index.css";

/**
 * WordCounter : www-word-counter
 * 
 * observedAttributes:
 * - selector: css selector which is counted by the counter
 * - css-link: an url to a css file which will be added to the component to update his style
 */
export class WordCounter extends HTMLElement {
    static init(debug:boolean) {
        window.customElements.define('www-word-counter', WordCounter);
        if(debug){
            console.log("init:www-word-counter")
        }
        return WordCounter;
    }

    static get observedAttributes() { return ['selector', 'css-link']; }

    observedElement: HTMLElement | undefined;
    csslinkElement: HTMLLinkElement | undefined;

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = view;

        const style = document.createElement("style");
        style.innerHTML = css;
        shadowRoot.append(style);
    }

    attributeChangedCallback(name: string, oldValue: any, newValue: any) {
        (this as any)["on" + capitalizeFirstLetter(name).replace("-", "")](oldValue, newValue);
    }

    onSelector(oldValue: any, newValue: any) {
        if (typeof newValue != "string") throw new TypeError()
        this.observedElement?.removeEventListener("DOMSubtreeModified", this.updateView.bind(this))

        const observedElement = document.querySelector(newValue) as HTMLElement | null;
        if (!observedElement) throw new Error("DOM Error")
        this.observedElement = observedElement;
        this.updateView();

        this.observedElement.addEventListener("DOMSubtreeModified", this.updateView.bind(this))
    }

    onCsslink(oldValue: any, newValue: any) {
        if (typeof newValue != "string") throw new TypeError()
        this.setCsslink(newValue)
    }

    count() {
        if (!this.observedElement) return { words: 0, characters: 0 };
        const text = this.observedElement.textContent || "";
        const characters = text?.length || 0;

        let regex = /(\w+)/g
        const words = (text.match(regex) || []).length

        return {
            words,
            characters
        }
    }

    setCsslink(link: string) {
        const html = `<link rel="stylesheet" href="${link}">`;
        if (this.csslinkElement) this.csslinkElement.remove();
        this.csslinkElement = strToHtml(html)[0] as HTMLLinkElement;
        this.shadowRoot?.prepend(css);
    }

    updateView() {
        const words = this.shadowRoot!.querySelector("#wordsCount")
        const characters = this.shadowRoot!.querySelector("#charactersCount")
        if (!words || !characters) throw new Error("DOM Error");

        const count = this.count();
        words.innerHTML = count.words.toString()
        characters.innerHTML = count.characters.toString()
    }
}