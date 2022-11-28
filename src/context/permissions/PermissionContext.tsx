//React
import { createContext, FC, useState } from "react";
import { toast } from "react-toastify";
//Helpers
import { validate } from '../../helpers/response';
//Interfaces
import { Permission } from '../../interfaces/PermissionInterface';
//Services
import { storePermission, updatePermission, destroyPermission, restorePermission, getPermission, getPermissionByRole } from '../../services/permissionService';
//Extras
import Swal from "sweetalert2";

interface ContextProps {
    permission:                 Permission;
    createPermission:           (name: string, label: string, description: string | null, access_token: string) => Promise<boolean | undefined>;
    editPermission:             (id: string, name: string, label: string, description: string | null, access_token: string) => Promise<boolean | undefined>;
    deletePermission:           (id: string, access_token: string) => Promise<boolean | undefined>;
    undeletePermission:         (id: string, access_token: string) => Promise<boolean | undefined>;
    showPermission:             (id: string, access_token: string) => Promise<Permission | undefined>;
    showPermissionByRole:       (id: string, access_token: string) => Promise<Permission[] | Permission | undefined>;
}

export const PermissionContext                      = createContext({} as ContextProps);

const INITIAL_STATE: Permission                     = {
    name:                                           '',
    label:                                          '',
    description:                                    ''
};

export const PermissionProvider: FC                 = ({ children }) => {
    const [ permission, setPermission ]             = useState(INITIAL_STATE);

    const createPermission                          = async (name: string, label: string, description: string | null, access_token: string) => {

        if(name && label && access_token) {
 
            const response                          = await storePermission(name, label, description, access_token);

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
                
                const currentPermission             = {
                    name:                           data.permissions.name,
                    label:                          data.permissions.label,
                    description:                    data.permissions.description
                }

                setPermission(currentPermission);

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
    const deletePermission                          = async (id: string, access_token: string) => {
        if(id && access_token) {
            const response                          = await destroyPermission(id, access_token);

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
    const editPermission                            = async (id: string, name: string, label: string, description: string | null, access_token: string) => {
        
        if(name && label && access_token) {
            const response                          = await updatePermission(id, name, label, description, access_token);

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
                
                const currentPermission             = {
                    name:                           data.permissions.name,
                    label:                          data.permissions.label,
                    description:                    data.permissions.description
                }

                setPermission(currentPermission);
                       
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
    const undeletePermission                        = async (id: string, access_token: string) => {
        if(id && access_token) {
            const response                          = await restorePermission(id, access_token);

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
    const showPermission                            = async (id: string, access_token: string) => {
        if(id && access_token) {
            const response                          = await getPermission(id, access_token);

            if(response && response.ok) {
                toast.error(response.msg);
            }

            if(response && response.data) {      
                return response.data.permissions;
            }
        }
    }
    const showPermissionByRole                      = async (id: string, access_token: string) => {
        if(id && access_token) {
            const response                          = await getPermissionByRole(id, access_token);

            if(response && response.ok) {
                toast.error(response.msg);
            }

            if(response && response.data) {      
                return response.data.permissions;
            }
        }
    }
    return (
        <PermissionContext.Provider
          value={{
           permission,
           createPermission,
           deletePermission,
           editPermission,
           undeletePermission,
           showPermission,
           showPermissionByRole
          }}
        >
          {children}
        </PermissionContext.Provider>
    );
}