import { WordCounter } from './workspace/wordCounter';

const debug = true;
export function componentsInit() {
    return{
        WordCounter : WordCounter.init(debug)
    }
}