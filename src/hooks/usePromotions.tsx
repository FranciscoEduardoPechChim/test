//React
import { useEffect, useState } from "react";
//Services
import { getPromotions } from '../services/promotionService';

export const usePromotions                      = (access_token: string) => {
    const [promotions, setPromotions]           = useState<any>([]);
    const [loading, setLoading]                 = useState(false);

    const init                                  = async () => {
        if(access_token) {
            setLoading(true);

            const response                      = await getPromotions(access_token);

            if(response) {
                if(response.data) {
                    const { data }      = response;

                    setPromotions(data.promotions);
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
        promotions:                     promotions,
        init:                           init
    }
}


  