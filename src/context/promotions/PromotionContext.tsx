//React
import { createContext, Dispatch, FC, SetStateAction, useCallback, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
//Helpers
import { validate } from '../../helpers/response';
//Interfaces
import { Promotion } from '../../interfaces/PromotionInterface';
//Services
import { storePromotion, updatePromotion, destroyPromotion, restorePromotion } from '../../services/promotionService';

interface ContextProps {
    createPromotion:    (code: string, startDate: Date | null, endDate: Date | null,  quantity: number, type: number, repeat: number) => Promise<boolean | undefined>;
    editPromotion:      (id: string, code: string, startDate: Date | null, endDate: Date | null,  quantity: number, type: number, repeat: number) => Promise<boolean | undefined>;
    deletePromotion:    (id: string) => Promise<boolean | undefined>;
    undeletePromotion:  (id: string) => Promise<boolean | undefined>;
}

export const PromotionContext                       = createContext({} as ContextProps);

const INITIAL_STATE: Promotion                      = {
    code:                                           '',
    startDate:                                      null,
    endDate:                                        null,
    quantity:                                       0,
    type:                                           0,
    repeat:                                         0
};

export const PromotionProvider: FC                  = ({ children }) => {
    const access_token                              = localStorage.getItem("token")
    const [promotion, setPromotion]                 = useState(INITIAL_STATE);

    const createPromotion                           = async (code: string, startDate: Date | null, endDate: Date | null,  quantity: number, type: number, repeat: number) => {

        if(code && quantity && type && repeat && access_token) {
            const response                          = await storePromotion(code, startDate, endDate, quantity, type, repeat, access_token);

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
                
                const currentPromotion              = {
                    code:                         data.promotions.code,
                    startDate:                    data.promotions.startDate,
                    endDate:                      data.promotions.endDate,
                    quantity:                     data.promotions.quantity,
                    type:                         data.promotions.type,
                    repeat:                       data.promotions.repeat 
                }

                setPromotion(currentPromotion);
                
                return true;
            }
        }

        return false;
    }
    const deletePromotion                           = async (id: string) => {
        if(id && access_token) {
            const response                          = await destroyPromotion(id, access_token);

            if(response && response.ok) {
                toast.error(response.msg);
                return false;
            }

            if(response && response.data) {      
                return true;
            }

        }

        return false;
    }
    const editPromotion                             = async (id: string, code: string, startDate: Date | null, endDate: Date | null,  quantity: number, type: number, repeat: number) => {
        if(id && code && quantity && type && repeat && access_token) {
            const response                          = await updatePromotion(id, code, startDate, endDate, quantity, type, repeat, access_token);

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
                
                const currentPromotion              = {
                    code:                         data.promotions.code,
                    startDate:                    data.promotions.startDate,
                    endDate:                      data.promotions.endDate,
                    quantity:                     data.promotions.quantity,
                    type:                         data.promotions.type,
                    repeat:                       data.promotions.repeat 
                }

                setPromotion(currentPromotion);
                
                return true;
            }

        }

        return false;
    }
    const undeletePromotion                         = async (id: string) => {
        if(id && access_token) {
            const response                          = await restorePromotion(id, access_token);

            if(response && response.ok) {
                toast.error(response.msg);
                return false;
            }

            if(response && response.data) {      
                return true;
            }
        }

        return false;
    }

    return (
        <PromotionContext.Provider
          value={{
           createPromotion,
           deletePromotion,
           editPromotion,
           undeletePromotion
          }}
        >
          {children}
        </PromotionContext.Provider>
    );
}