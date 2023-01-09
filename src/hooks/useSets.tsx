import { useEffect, useState } from "react";
import { getSets } from '../services/setServices';

export const useSets                = () => {
    const [loading, setLoading]     = useState(true);
    const [sets,setSets]            = useState<any>([]);

    const init                      = async () => {
        const response          = await getSets();
            
        if(response && response.data) {
            setSets(response.data.sets);
            setLoading(false);
        }
    }

   useEffect(() => {
      init();
    }, []);

    return {
        loadingSet:                 loading,
        sets:                       sets,
        init:                       init
    }
}