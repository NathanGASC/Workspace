import { Loggable } from "@nathangasc/fox_logger/dist/log";
import { capitalizeFirstLetter } from "../helpers/any";
import { strToHtml } from "../helpers/DOM";

export class Component extends HTMLElement{
    static comment: string = `Not commented`
    static conf:{
        warnMissingListenerFunction?: boolean,
        logActiveComponents?:boolean,
        logComponentsComment?:boolean,
        logCalledListenerFunction?: boolean
        logDependenciesCustomElement?: boolean
    } = {
        warnMissingListenerFunction: true,
        logActiveComponents: true,
        logComponentsComment: true,
        logCalledListenerFunction: true,
        logDependenciesCustomElement: false
    }
    
    static loggers:{[name:string]:Loggable} = {}
    static instances: {name:string, component:Component}[] = []
    csslinkElement: HTMLLinkElement | undefined;
    logger:Loggable|undefined

    constructor(view:string, css:string){
        super();
        Component.instances.push({"component":this, "name":this.tagName})
        this.logger = Component.loggers[this.tagName.toLowerCase()]

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = view;

        const style = document.createElement("style");
        style.innerHTML = css;
        shadowRoot.append(style);
    }

    static init(logger: Loggable, name:string){
        window.customElements.define(name, this);
        this.loggers[name.toLowerCase()] = logger;
        if(Component.conf.logComponentsComment) this.loggers[name.toLowerCase()].info("init: ",name,"\n", "----","\n",this.comment,"\n","----")
    }

    attributeChangedCallback(name: string, oldValue: any, newValue: any) {
        if((this as any)["on" + capitalizeFirstLetter(name).replace("-", "")]){
            if(Component.conf.logCalledListenerFunction) this.logger?.log("exec function on" + capitalizeFirstLetter(name).replace("-", "") + `(${oldValue}, ${newValue})`);
            (this as any)["on" + capitalizeFirstLetter(name).replace("-", "")](oldValue, newValue);
        }else{
            if(Component.conf.warnMissingListenerFunction) this.logger?.warn("can't exec function on" + capitalizeFirstLetter(name).replace("-", ""), "because it doesn't exist");
        }

    }

    onCss(oldValue: any, newValue: any) {
        if (typeof newValue != "string") throw new TypeError()
        this.setCss(newValue)
    }

    setCss(link: string) {
        const html = `<link rel="stylesheet" href="${link}">`;
        if (this.csslinkElement) this.csslinkElement.remove();
        this.csslinkElement = strToHtml(html)[0] as HTMLLinkElement;
        this.shadowRoot?.prepend(this.csslinkElement);
    }
}