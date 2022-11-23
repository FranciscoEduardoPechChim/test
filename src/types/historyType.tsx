import { History } from '../interfaces/HistoryInterface';
import { Errors } from '../interfaces/AuthInterface';

export type historyResponse   = {
    "ok"?:                  boolean,
    "msg"?:                 string,
    "data"?:                history,
    "errors"?:              Errors[]
}

export type history           = {
    "records":            History[] | History
}
