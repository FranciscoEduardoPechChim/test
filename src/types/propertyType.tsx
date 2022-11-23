//Interfaces
import { Errors } from '../interfaces/AuthInterface';
import { Inmueble } from '../interfaces/InmueblesInterface';

export type propertyResponse   = {
    "ok"?:                  boolean,
    "msg"?:                 string,
    "data"?:                property,
    "errors"?:              Errors[]
}

export type property          = { 
    "properties":           Inmueble[],
    "total"?:               number
}


