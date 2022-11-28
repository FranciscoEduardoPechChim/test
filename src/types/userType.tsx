//Interfaces
import { Auth, Errors } from '../interfaces/AuthInterface';

export type userResponse    = {
    "ok"?:                  boolean,
    "msg"?:                 string,
    "data"?:                user,
    "errors"?:              Errors[]
}

export type user            = { 
    "users":                Auth[] | Auth
}

