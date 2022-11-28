import { Auth, Errors } from '../interfaces/AuthInterface';

export type loginResponse   = {
    "ok"?:                  boolean,
    "msg"?:                 string,
    "data"?:                Login,
    "errors"?:              Errors[]
}

export type recoveryPassword = {
    "ok"?:                  boolean,
    "msg"?:                 string,
    "data"?:                {},
    "errors"?:              Errors[]
}

export type Login           = { 
    "user":                 Auth,
    "access_token"?:        string
}




