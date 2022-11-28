import { useEffect, useState } from "react";
import { getSets } from '../services/setServices';

export const useSets                = (access_token: string) => {
    const [loading, setLoading]     = useState(true);
    const [sets,setSets]            = useState<any>([]);

    const init                      = async () => {
        if(access_token) {
            const response          = await getSets(access_token);
            
            if(response && response.data) {
                setSets(response.data.sets);
                setLoading(false);
            }
        }
    }

   useEffect(() => {
      init();
    }, []);

    return {
        loadingSet:                 loading,
        sets:                       sets
    }
}