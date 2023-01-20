//Interfaces
import { Auth, Errors } from '../interfaces/AuthInterface';

export type userResponse    = {
    "ok"?:                  boolean,
    "msg"?:                 string,
    "data"?:                user,
    "errors"?:              Errors[]
}

export type user            = { 
    "users":                Auth[] | Auth,
    "total"?:               number
}

export type profileResponse = {
    "ok"?:                  boolean,
    "msg"?:                 string,
    "data"?:                profile,
    "errors"?:              Errors[]
}

export type profile         = { 
    "user":                 Auth
}