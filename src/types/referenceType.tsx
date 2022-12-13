//Interfaces
import { Errors } from '../interfaces/AuthInterface';
import { Referencia } from '../interfaces/ReferenciasInterface';

export type referenceResponse   = {
    "ok"?:                  boolean,
    "msg"?:                 string,
    "data"?:                reference,
    "errors"?:              Errors[]
}

export type reference          = { 
    "references":          Referencia
}
