import { Component } from '../tools';

/**
* TwoDTable is used to display a 2D array in a table
*  
* observedAttributes:
* - object: the object to display in the form of an array
 */
export class TwoDTable extends Component {
    public static _observedAttributes = ['object']

    static get observedAttributes() { return this._observedAttributes; }
    static comment: string = `
    * TwoDTable is used to display a 2D array in a table
    *  
    * observedAttributes:
    * - object: the object to display in the form of an array
    `;

    constructor() {
        super("", "");
    }

    onObject(oldValue:any, newValue:any){
        if(typeof newValue != "string") return;

        this.shadowRoot!.innerHTML = "";

        const table = document.createElement("table");
        const tbody = document.createElement("tbody");

        this.shadowRoot?.append(table);
        table.append(tbody);

        let column: (string|number)[][];
        try{
            column = JSON.parse(newValue);
        }catch(e){
            throw new TypeError("An error occured on json parsing for given object. Check that is corresponding of an object in the format {[keys:string]:string[]}.");
        }

        if(!Array.isArray(column)) throw new TypeError("The given object isn't an array of array of string or number")
        column.forEach((row,i) => {
            if(!Array.isArray(row)) throw new TypeError("The given object isn't an array of array of string or number")

            const tr = document.createElement("tr");
            tbody.appendChild(tr);

            row.forEach((value,i)=>{
                if(typeof value != "string" && typeof value != "number") throw new TypeError("The given object isn't an array of array of string or number")

                const td = document.createElement("td");
                td.textContent = value.toString();
                tr.append(td);
            })
        });
    }
}