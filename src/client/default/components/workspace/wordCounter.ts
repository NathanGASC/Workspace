import { capitalizeFirstLetter } from '../../helpers/any';
import { strToHtml } from '../../helpers/DOM';
import view from "./assets/wordCounter/index.html";
import css from "./assets/wordCounter/index.css";
import { Component } from '../tools';

/**
 * WordCounter is used to count words in a HTML element.
 * observedAttributes:
 * - selector: css selector which is counted by the counter
 */
export class WordCounter extends Component {
    public static _observedAttributes = ['selector']

    static get observedAttributes() { return this._observedAttributes; }
    static comment: string = `
    * WordCounter is used to count words in a HTML element.
    * observedAttributes:
    * - selector: css selector which is counted by the counter
    `;

    observedElement: HTMLElement | ShadowRoot | undefined;
    mutationObserver: MutationObserver | undefined

    constructor() {
        super(view, css);
    }

    onSelector(oldValue: any, newValue: any) {
        if (typeof newValue != "string") throw new TypeError()
        this.mutationObserver?.disconnect();

        let observedElement;
        try{
            observedElement = document.querySelector(newValue) as HTMLElement | null;
            if(!observedElement){
                this.logger?.error(`The given selector "${newValue}" don't point on an existing element`)
                return;
            }
        }catch(e){
            this.logger?.error(`The given selector "${newValue}" don't point on an existing element`)
            throw e;
        }
        this.logger?.log(`Selector ${newValue} point on`, observedElement);

        
        this.observedElement = observedElement.shadowRoot ? observedElement.shadowRoot : observedElement;
        this.updateView();

        this.mutationObserver = new MutationObserver(this.updateView.bind(this));
        this.mutationObserver.observe(this.observedElement, {"subtree": true, "childList":true, "characterData":true})
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

    updateView() {
        const words = this.shadowRoot!.querySelector("#wordsCount")
        const characters = this.shadowRoot!.querySelector("#charactersCount")
        if (!words || !characters) throw new Error("DOM Error");

        const count = this.count();
        words.innerHTML = count.words.toString()
        characters.innerHTML = count.characters.toString()
    }
}