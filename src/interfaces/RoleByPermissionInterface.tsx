export interface RoleByPermission {
    _id?:                   string;
    roleId:                 string;
    roleName:               string;
    permissionId:           string;
    permissionName:         string;
}

export interface PermissionsByGroup{
    Administrador?:         RoleByPermission[];
    Usuario?:               RoleByPermission[];
    Individual?:            RoleByPermission[];
    Básico?:                RoleByPermission[];
    Intermedio?:            RoleByPermission[];
    Avanzado?:              RoleByPermission[];
    UsuarioPagado?:         RoleByPermission[];
    SuperAdministrador?:    RoleByPermission[];
}

