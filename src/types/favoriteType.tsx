//Interfaces
import { Errors } from '../interfaces/AuthInterface';
import { Favorito } from '../interfaces/Favoritos';

export type favoriteResponse   = {
    "ok"?:                  boolean,
    "msg"?:                 string,
    "data"?:                favorite,
    "errors"?:              Errors[]
}

export type favorite          = { 
    "requests":             Favorito[],
    "total"?:               number
}



