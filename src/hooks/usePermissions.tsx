//React
import { useEffect, useState } from "react";
//Services
import { getPermissions } from '../services/permissionService';

export const usePermissions                     = (access_token: string) => {
    const [permissions, setPermissions]         = useState<any>([]);
    const [loading, setLoading]                 = useState(false);

    const init                                  = async () => {
        if(access_token) {
            setLoading(true);

            const response                      = await getPermissions(access_token);

            if(response) {
                if(response.data) {
                    const { data }              = response;

                    setPermissions(data.permissions);
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
        permissions:                    permissions,
        init:                           init
    }
}


  