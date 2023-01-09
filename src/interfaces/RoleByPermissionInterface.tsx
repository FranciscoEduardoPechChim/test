import { Role } from './RoleInterface';
import { Permission } from './PermissionInterface';

export interface RoleByPermission {
    _id?:                   string;
    roleId:                 Role;
    permissionId:           Permission;
    deleted?:               boolean;
}

export interface PermissionsByGroup {
    _id?:                   string;
    role?:                  Role[];
    roles:                  Role | string;
    permissions:            RoleByPermission[] | string;
    deleted?:               boolean;
}
