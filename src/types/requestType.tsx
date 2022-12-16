//Interfaces
import { Errors } from '../interfaces/AuthInterface';
import { Solicitud } from '../interfaces/SolicitudInteface';

export type requestResponse   = {
    "ok"?:                  boolean,
    "msg"?:                 string,
    "data"?:                request,
    "errors"?:              Errors[]
}

export type request          = { 
    "requests":             Solicitud[],
    "total"?:               number
}



