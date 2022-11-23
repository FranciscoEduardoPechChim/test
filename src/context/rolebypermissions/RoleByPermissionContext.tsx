//React
import { createContext, FC, useState } from "react";
import { toast } from "react-toastify";
//Helpers
import { validate } from '../../helpers/response';
//Interfaces
import { PermissionsByGroup } from '../../interfaces/RoleByPermissionInterface';
//Services
import { storeRoleByPermission, updateRoleByPermission, destroyRoleByPermission, getRoleByPermission, restoreRoleByPermission} from '../../services/rolebypermissionService';
//Extras
import Swal from "sweetalert2";

interface ContextProps {
    roleByPermission:           PermissionsByGroup;
    createRoleByPermission:     (roleId: string, permissionId: string, access_token: string) => Promise<boolean | undefined>;
    editRoleByPermission:       (id: string, roleId: string, permissionId: string, access_token: string) => Promise<boolean | undefined>;
    deleteRoleByPermission:     (id: string, access_token: string) => Promise<boolean | undefined>;
    undeleteRoleByPermission:   (id: string, access_token: string) => Promise<boolean | undefined>;
    showRoleByPermission:       (id: string, access_token: string) => Promise<PermissionsByGroup | undefined>;
}

export const RoleByPermissionContext                = createContext({} as ContextProps);

const INITIAL_STATE: PermissionsByGroup             = {
    _id:                                            '',
    roles:                                          '',
    permissions:                                    [],
};

export const RoleByPermissionProvider: FC           = ({ children }) => {
    const [ roleByPermission, setRoleByPermission ] = useState(INITIAL_STATE);

    const createRoleByPermission                    = async (roleId: string, permissionId: string, access_token: string) => {

        if(roleId && permissionId && access_token) {
 
            const response                          = await storeRoleByPermission(roleId, permissionId, access_token);

            if(response && response.errors) {
                validate(response.errors);
                return false;
            }

            if(response && response.ok) {
                toast.error(response.msg);
                return false;
            }

            if(response && response.data) {
                const { data }                      = response;

                setRoleByPermission(data.rolebypermissions[0]);

                Swal.fire({
                    title: '',
                    html: response.msg,
                    icon: 'success',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });
                  
                return true;
            }
        }

        return false;
    }
    const deleteRoleByPermission                    = async (id: string, access_token: string) => {
        if(id && access_token) {
            const response                          = await destroyRoleByPermission(id, access_token);

            if(response && response.ok) {
                toast.error(response.msg);
                return false;
            }

            if(response && response.data) {      

                Swal.fire({
                    title: '',
                    html: response.msg,
                    icon: 'success',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });

                return true;
            }

        }

        return false;
    }
    const editRoleByPermission                      = async (id: string, roleId: string, permissionId: string, access_token: string) => {
        
        if(roleId && permissionId && access_token) {
            const response                          = await updateRoleByPermission(id, roleId, permissionId, access_token);

            if(response && response.errors) {
                validate(response.errors);
                return false;
            }

            if(response && response.ok) {
                toast.error(response.msg);
                return false;
            }

            if(response && response.data) {    
                const { data }                      = response;

                setRoleByPermission(data.rolebypermissions[0]);

                Swal.fire({
                    title: '',
                    html: response.msg,
                    icon: 'success',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });

                return true;
            }
        }

        return false;
    }
    const showRoleByPermission                      = async (id: string, access_token: string) => {
        if(id && access_token) {
            const response                          = await getRoleByPermission(id, access_token);

            if(response && response.ok) {
                toast.error(response.msg);
            }

            if(response && response.data) {      
                return response.data.rolebypermissions[0];
            }
        }
    }
    const undeleteRoleByPermission                  = async (id: string, access_token: string) => {
        if(id && access_token) {
            const response                          = await restoreRoleByPermission(id, access_token);

            if(response && response.ok) {
                toast.error(response.msg);
                return false;
            }

            if(response && response.data) {      
                Swal.fire({
                    title: '',
                    html: response.msg,
                    icon: 'success',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });

                return true;
            }
        }

        return false;
    }
    return (
        <RoleByPermissionContext.Provider
          value={{
           roleByPermission,
           createRoleByPermission,
           deleteRoleByPermission,
           editRoleByPermission,
           showRoleByPermission,
           undeleteRoleByPermission
          }}
        >
          {children}
        </RoleByPermissionContext.Provider>
    );
}