//Interfaces
import { Errors } from '../interfaces/AuthInterface';
import { PermissionsByGroup } from '../interfaces/RoleByPermissionInterface';

export type rolebypermissionResponse        = {
    "ok"?:                                  boolean,
    "msg"?:                                 string,
    "data"?:                                rolebypermission,
    "errors"?:                              Errors[]
}

export type rolebypermission                = { 
    "rolebypermissions":                    PermissionsByGroup[],
    "total"?:                               number
}

export type rolebypermissionArrayResponse   = {
    "ok"?:                                  boolean,
    "msg"?:                                 string,
    "data"?:                                rolebypermissionarray,
    "errors"?:                              Errors[]
}

export type rolebypermissionarray           = {
    "rolebypermissions":                    any,
}