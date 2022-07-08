import { dependencieInit } from '../components';
import { Component } from '../tools';
import view from './assets/paginableTable/index.html';
import { TwoDTable } from './twoDTable';

/**
* PaginableTable is used to display a 3D array in a form of paginable table
*  
* dependencies:
* - www-twod-table : TwoDTable
*  
* observedAttributes:
* - object: the object to display in the form of an array
* - page: the page to display
 */
export class PaginableTable extends Component {
    public static _observedAttributes = ['object','page']

    static get observedAttributes() { return this._observedAttributes; }
    static comment: string = `
    * PaginableTable is used to display a 3D array in a form of paginable table
    *
    * dependencies:
    * - www-twod-table : TwoDTable
    *  
    * observedAttributes:
    * - object: the object to display in the form of an array
    * - page: the page to display
    `;

    constructor() {
        super(view, "");
        dependencieInit(TwoDTable, "www-twod-table");
    }

    page:number = 0;
    object:(string|number)[][] = [[]];

    onObject(oldValue:any, newValue:any){
        if(typeof newValue != "string") return;

        let pages: (string|number)[][];
        try{
            pages = JSON.parse(newValue);
        }catch(e){
            throw new TypeError("An error occured on json parsing for given object.");
        }

        if(!Array.isArray(pages)) throw new TypeError("The given object isn't an array of array of array of string or number")
        pages.forEach((column,i) => {
            if(!Array.isArray(column)) throw new TypeError("The given object isn't an array of array of array of string or number")
            column.forEach((row,i)=>{
                if(!Array.isArray(row)) throw new TypeError("The given object isn't an array of array of array of string or number")
                row.forEach((value,i)=>{
                    if(typeof value != "string" && typeof value != "number") throw new TypeError("The given object isn't an array of array of array of string or number")
                })
            })
        });

        this.object = pages
        this.shadowRoot!.querySelector("www-twod-table")?.setAttribute("object", JSON.stringify(pages[this.page]))
    }

    onPage(oldValue:any, newValue:any){
        if(typeof newValue != "string") throw new TypeError("An error occured on json parsing for given object.");
        this.page = parseInt(newValue) || 0;
        this.shadowRoot!.querySelector("www-twod-table")?.setAttribute("object", JSON.stringify(this.object[this.page]))
    }

    /**
     * Navigate to the next page of the table
     * @returns 
     */
    next(){
        if(this.page == this.object.length-1) return
        this.page++;
        this.setAttribute("page", this.page.toString());
    }

    /**
     * Navigate to the previous page of the table
     * @returns 
     */
    previous(){
        if(this.page == 0) return
        this.page--;
        this.setAttribute("page", this.page.toString());
    }
}