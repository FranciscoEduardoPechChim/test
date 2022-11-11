//Interfaces
import { Errors } from '../interfaces/AuthInterface';
import { Permission } from '../interfaces/PermissionInterface';

export type permissionResponse   = {
    "ok"?:                  boolean,
    "msg"?:                 string,
    "data"?:                permission,
    "errors"?:              Errors[]
}

export type permission          = { 
    "permissions":          Permission,
    "total"?:               number
}


