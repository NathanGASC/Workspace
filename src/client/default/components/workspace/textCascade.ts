import { Component } from '../tools';

/**
 * TextCascade is used to display a texte letter by letter.
 * observedAttributes:
 * - text: the text to display in cascade
 * - speed: the cascade speed in ms (by default 10)
 * 
 * Note:
 * To permit dynamic writing, we don't reset the text on text change if the text from the start to the current display letter isn't different
 */
export class TextCascade extends Component {
    public static _observedAttributes = ['text', 'speed']

    static get observedAttributes() { return this._observedAttributes; }
    static comment: string = `
    * TextCascade is used to display a texte letter by letter.
    * observedAttributes:
    * - text: the text to display in cascade
    * - speed: the cascade speed in ms (by default 10)
    * 
    * Note:
    * To permit dynamic writing, we don't reset the text on text change if the text from the start to the current display letter isn't different
    `;

    cursor:number = 0;
    intervalId:NodeJS.Timer|undefined;
    status:"play"|"pause" = "pause";

    constructor() {
        super("", "");
    }
    
    onText(oldValue:any, newValue:any){
        if(!oldValue) oldValue = ""
        if(!newValue) newValue = ""
        if(oldValue.substring(0, this.cursor) != newValue.substring(0, this.cursor)){
            this.cursor = 0;
            this.shadowRoot!.innerHTML = "";
        }
    }

    /**
     * Pause the text cascade
     */
    pause(){
        this.status = "pause"
        if(this.intervalId) clearInterval(this.intervalId);
    }

    /**
     * Start or restart the text cascade
     */
    play(){
        this.status = "play"
        if(this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(()=>{
            const text = this.getAttribute("text");
            if(!text) return;
            const character = text[this.cursor];
            if(!character) return;
            this.shadowRoot!.textContent = this.shadowRoot!.textContent + character
            this.cursor++
        }, parseInt(this.getAttribute("speed")||"10"))
    }
}