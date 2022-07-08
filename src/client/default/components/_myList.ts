import { BtnList } from "./workspace/btnList"
import { PaginableTable } from "./workspace/paginableTable"
import { TextCascade } from "./workspace/textCascade"
import { WordCounter } from "./workspace/wordCounter"

export const components = {
    "www-word-counter" : WordCounter,
    "www-btn-list": BtnList,
    "www-text-cascade": TextCascade,
    "www-paginable-table": PaginableTable
}

export type Components = {
    "www-word-counter" : WordCounter,
    "www-btn-list": BtnList,
    "www-text-cascade": TextCascade,
    "www-paginable-table": PaginableTable
}