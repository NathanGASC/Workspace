import { createLogger } from '@nathangasc/fox_logger';
import { objToStrListOfKeys } from '../helpers/any';
import { Component } from './tools';
import { Config, LoggableNamespaces } from '@nathangasc/fox_logger/dist/log';
import { components, Components } from './_myList';

export type componentsT = typeof components;

let loggerConf:Config<any>|undefined;
let componentsConf:typeof Component.conf|undefined;
let loggers:LoggableNamespaces<any>;
export function componentsInit(logConf?: Config<any>, conf?:typeof Component.conf) {
    for (const key in conf) {
        Component.conf[key as keyof typeof Component.conf] = conf[key as keyof typeof Component.conf];
    }
    componentsConf = conf;

    loggerConf = {
        "namespaces":{
            "default":{
                "isLogged":logConf?.namespaces.default.isLogged ? logConf?.namespaces.default.isLogged : true,
            },
            "components":{
                "isLogged":logConf?.namespaces.components? logConf.namespaces.components.isLogged : true,
            }
        },
        "options": logConf?.options ? logConf.options : {
            "format": "[{{h}}:{{m}}:{{s}}] {{namespace}} :",
            "isLogged": {
                "debug": true,
                "error": true,
                "info": true,
                "log": true,
                "warn": true
            }
        }
    }

    for (const key in components) {
        loggerConf.namespaces[key] = {
            "isLogged": logConf?.namespaces[key] ? logConf.namespaces[key].isLogged : true
        }
    }

    if(logConf)
        Object.keys(logConf.namespaces).forEach((key)=>{
            loggerConf!.namespaces[key] = logConf.namespaces[key];
        })

    loggers = createLogger(loggerConf as Config<any>)

    if(Component.conf.logActiveComponents) (loggers as LoggableNamespaces<any>).components.info(`Thanks for using this components system. Hope you will find it usefull. You currently have ${Object.keys(components).length} active components: 
${objToStrListOfKeys(components)}
    `)
    for (const key in components) {
        components[key as keyof componentsT]._observedAttributes.push("css")
        components[key as keyof componentsT].init(loggers[key], key);
    }
}

export function dependencieInit(component:any, name:string){
    let editedLoggerConf = loggerConf!;
    let shouldLog = false;
    if(componentsConf?.logDependenciesCustomElement != undefined)
        shouldLog = componentsConf?.logDependenciesCustomElement;
    if(loggerConf!.namespaces[name]?.isLogged != undefined)
        shouldLog = loggerConf!.namespaces[name].isLogged;

    editedLoggerConf.namespaces[name] = {"isLogged": shouldLog }
    const logger = createLogger(editedLoggerConf);
    component.init(logger[name], name)
}

declare global{
    interface ParentNode extends Node {
        querySelector<K extends keyof Components>(selectors: K): Components[K] | null;
        querySelectorAll<K extends keyof Components>(selectors: K): NodeListOf<Components[K]>;
    }
}
