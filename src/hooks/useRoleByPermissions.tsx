//React
import { useEffect, useState } from "react";
//Services
import { getRoleByPermissions } from '../services/rolebypermissionService';

export const useRoleByPermissions                   = (access_token: string) => {
    const [roleByPermissions, setRoleByPermissions] = useState<any>([]);
    const [loading, setLoading]                     = useState(false);

    const init                                      = async () => {
        if(access_token) {
            setLoading(true);

            const response                          = await getRoleByPermissions(access_token);

            if(response) {
                if(response.data) {
                    const { data }                  = response;

                    setRoleByPermissions(data.rolebypermissions);
                }

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
        init:                           init
    }
}


  