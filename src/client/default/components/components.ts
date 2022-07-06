import { WordCounter } from './workspace/wordCounter';
import { LoggableNamespaces } from '@nathangasc/fox_logger/dist/log';
import { objToStrListOfKeys } from '../helpers/any';
import { BtnList } from './workspace/btnList';
import { TextCascade } from './workspace/textCascade';
import { Component } from './tools';
import { TwoDTable } from './workspace/TwoDTable';

//TODO: we don't wan't to come here when we create custom components. (Passing them in componentsInit can be a solution)
//FOR USERS : Add your components here
const components = {
    "www-word-counter" : WordCounter,
    "www-btn-list": BtnList,
    "www-text-cascade": TextCascade,
    "www-twod-table": TwoDTable
}

//FOR USERS : Type components should be same as const components
type Components = {
    "www-word-counter" : WordCounter,
    "www-btn-list": BtnList,
    "www-text-cascade": TextCascade,
    "www-twod-table": TwoDTable
}

export type componentsT = typeof components;

export function componentsInit(logger: LoggableNamespaces<componentsT & {components:""}>, conf?:typeof Component.conf) {
    for (const key in conf) {
        Component.conf[key as keyof typeof Component.conf] = conf[key as keyof typeof Component.conf];
    }

    if(Component.conf.logActiveComponents) logger.components.info(`Thanks for using this components system. Hope you will find it usefull. You currently have ${Object.keys(components).length} active components: 
${objToStrListOfKeys(components)}
    `)
    for (const key in components) {
        components[key as keyof componentsT]._observedAttributes.push("css")
        components[key as keyof componentsT].init(logger[key as keyof componentsT], key);
    }
}

declare global{
    interface ParentNode extends Node {
        querySelector<K extends keyof Components>(selectors: K): Components[K] | null;
    }
}
