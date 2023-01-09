//React
import { useEffect, useState } from "react";
//Services
import { getRoleByPermissions } from '../services/rolebypermissionService';
import { getRolesWithoutPermissions } from '../services/roleService';

export const useRoleByPermissions                   = (access_token: string) => {
    const [roleByPermissions, setRoleByPermissions] = useState<any>([]);
    const [roles, setRoles]                         = useState<any>([]);
    const [loading, setLoading]                     = useState(false);

    const init                                      = async () => {
        if(access_token) {
            setLoading(true);

            const dataRoleByPermissionResponse      = await getRoleByPermissions(access_token);
            const dataRoleResponse                  = await getRolesWithoutPermissions('0', access_token);

            if(dataRoleByPermissionResponse && dataRoleResponse && dataRoleByPermissionResponse.data && dataRoleResponse.data) {       
                setRoleByPermissions(dataRoleByPermissionResponse.data.rolebypermissions);
                setRoles(dataRoleResponse.data.roles);
            }
            
            setLoading(false);
        }
    }

    const edit                                      = async (id:string) => {
        if(id && access_token) {
            setLoading(true);
            const response                          = await getRolesWithoutPermissions(id, access_token);

            if(response && response.data) {
                setRoles(response.data.roles);
                setLoading(false);
            }
        }
    }

    const updateRoles                               = async () => {
        if(access_token) {
            setLoading(true);
            const response                          = await getRolesWithoutPermissions('0', access_token);

            if(response && response.data) {
                setRoles(response.data.roles);
            
                setLoading(false);
            }

        }
    }

    useEffect(() => {
        init();
    }, []);

    
    return  {
        loadings:                       loading,
        roleByPermissions:              roleByPermissions,
        roles:                          roles,
        init:                           init,
        edit:                           edit,
        updateRoles:                    updateRoles
    }
}


  