//Interfaces
import { Errors } from '../interfaces/AuthInterface';
import { Solicitud } from '../interfaces/SolicitudInteface';
import { IsProperties } from '../interfaces/SolicitudInteface';

export type requestResponse   = {
    "ok"?:                  boolean,
    "msg"?:                 string,
    "data"?:                request,
    "errors"?:              Errors[]
}

export type request          = { 
    "requests":             Solicitud[],
    "total"?:               number,
    "isValid"?:             boolean,
}

export type isPropertiesResponse   = {
    "ok"?:                  boolean,
    "msg"?:                 string,
    "data"?:                isproperties,
    "errors"?:              Errors[]
}

export type isproperties            = {
    "isproperties":         IsProperties[],
    "total"?:               number
}

