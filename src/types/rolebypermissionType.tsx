//Interfaces
import { Errors } from '../interfaces/AuthInterface';
import { RoleByPermission } from '../interfaces/RoleByPermissionInterface';

export type rolebypermissionResponse   = {
    "ok"?:                  boolean,
    "msg"?:                 string,
    "data"?:                rolebypermission,
    "errors"?:              Errors[]
}

export type rolebypermission           = { 
    "rolebypermissions":    permissionsbygroup,
    "total"?:               number
}

export type permissionsbygroup         = {
    "Administrador"?:                  RoleByPermission[],
    "Usuario"?:                        RoleByPermission[],
    "Individual"?:                     RoleByPermission[],
    "Básico"?:                         RoleByPermission[],
    "Intermedio"?:                     RoleByPermission[],
    "Avanzado"?:                       RoleByPermission[],
    "UsuarioPagado"?:                  RoleByPermission[],
    "SuperAdministrador"?:             RoleByPermission[]
}



