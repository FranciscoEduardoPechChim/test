//Interfaces
import { Errors } from '../interfaces/AuthInterface';
import { Set } from '../interfaces/SetInterface';

export type setResponse   = {
    "ok"?:                  boolean,
    "msg"?:                 string,
    "data"?:                set,
    "errors"?:              Errors[]
}

export type set          = { 
    "sets":                 Set[],
    "total"?:               number
}


