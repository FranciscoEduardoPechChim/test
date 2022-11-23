//Interfaces
import { Errors } from '../interfaces/AuthInterface';
import { Role } from '../interfaces/RoleInterface';

export type roleResponse    = {
    "ok"?:                  boolean,
    "msg"?:                 string,
    "data"?:                role,
    "errors"?:              Errors[]
}

export type role            = { 
    "roles":                Role,
    "total"?:               number
}


