//React
import { useContext, useEffect, useState } from "react";
//Services
import { getPromotions, getPromotion } from '../services/promotionService';
//Types
import { promotionResponse } from '../types/promotionType';
//Interfaces
import { Promotion } from '../interfaces/PromotionInterface';
//Extras
import { PromotionContext } from "context/promotions/PromotionContext";

export const usePromotions                      = (offset: number, limit: number) => {
    const [promotions, setPromotions]           = useState<any>([]);
    const [total, setTotal]                     = useState(0);
    const [loading, setLoading]                 = useState(false);

    const access_token                          = localStorage.getItem("token")

    const init                                  = async () => {
        if(access_token) {
            setLoading(true);

            const response                      = await getPromotions(offset, limit, access_token);

            if(response) {
                if(response.data) {
                    const { data }      = response;

                    if(data.total) {
                        setTotal(data.total);
                    }
                    setPromotions(data.promotions);
                }

                setLoading(false);
            }

        }
    }

    useEffect(() => {
        init();
    }, [offset, limit]);

    
    return  {
        loading:                        loading,
        promotions:                     promotions,
        total:                          total
    }
}