export interface RoleByPermission {
    _id?:                   string;
    roleId:                 string;
    roleName:               string;
    permissionId:           string;
    permissionName:         string;
    deleted?:               boolean;
}

export interface PermissionsByGroup {
    _id:                    string;
    roles:                  string;
    permissions:            RoleByPermission[];
    deleted?:               boolean;
}
