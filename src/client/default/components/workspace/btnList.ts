import view from "./assets/btnList/index.html";
import css from "./assets/btnList/index.css";
import { Component } from '../tools';

/**
 * BtnList is used to create multiple buttons.
 * observedAttributes:
 * - items: a json of an array of strings which will create multiple buttons with the given strings as text
 */
export class BtnList extends Component {
    public static _observedAttributes = ['items']

    static get observedAttributes() { return this._observedAttributes; }
    static comment: string = `
    * BtnList is used to create multiple buttons.
    * observedAttributes:
    * - items: a json of an array of strings which will create multiple buttons with the given strings as text
    `;

    listener: ((item:string) => any) | undefined

    constructor() {
        super(view, css);
    }

    onItems(oldValue: any, newValue: any){
        let json;
        try{
            json = JSON.parse(newValue);
        }catch(e){
            throw new TypeError("An error occured on json parsing for given items. Check that is corresponding of an array of string with right json format.");
        }

        if(!Array.isArray(json)){
            throw new TypeError("The given json contain something else than an array.");
        }

        let itemsHtml = "";
        json.forEach(item => {
            if(typeof item != "string"){
                throw new TypeError("An item in the given json array isn't a string.");
            }
            
            itemsHtml += `<button>${item}</button>`
        });

        const btnList = this.shadowRoot!.querySelector("div");
        if(!btnList) throw new Error();

        btnList.innerHTML = itemsHtml
        
        const btns = this.shadowRoot!.querySelectorAll("button");
        btns.forEach((btn)=>{
            btn.addEventListener("click", ()=>{
                if(this.listener) {
                    this.logger?.log("button \"" + btn.innerText + "\"", "has been clicked")
                    this.listener(btn.innerText);
                }
            });
        })
    }

    attachListener(listener: (item:string)=>any){
        this.listener = listener;
    }
}