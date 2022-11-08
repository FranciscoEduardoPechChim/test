//React
import { createContext, Dispatch, FC, SetStateAction, useCallback, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
//Helpers
import { validate } from '../../helpers/response';
//Interfaces
import { Promotion } from '../../interfaces/PromotionInterface';
import { Pedido } from '../../interfaces/PedidosInterface';
//Services
import { storePromotion, updatePromotion, destroyPromotion, restorePromotion, getPromotion, getPromotionByCode } from '../../services/promotionService';
import { getSubcription, getOrder } from '../../services/orderService';
//Extras
import Swal from "sweetalert2";

interface ContextProps {
    promotion:          Promotion;
    isValidPromotion:   (code: string, access_token: string) => Promise<Promotion | string | undefined>;
    createPromotion:    (code: string, startDate: Date | null, endDate: Date | null,  quantity: number, type: number, repeat: number, access_token: string) => Promise<boolean | undefined>;
    editPromotion:      (id: string, code: string, startDate: Date | null, endDate: Date | null,  quantity: number, type: number, repeat: number, access_token: string) => Promise<boolean | undefined>;
    deletePromotion:    (id: string, access_token: string) => Promise<boolean | undefined>;
    undeletePromotion:  (id: string, access_token: string) => Promise<boolean | undefined>;
    showPromotion:      (id: string, access_token: string) => Promise<Promotion | undefined>;
    isSubscription:     (id: string, access_token: string) => Promise<boolean | undefined>;
    showOrder:          (id: string, access_token: string) => Promise<Pedido | undefined>;
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
    const [ promotion, setPromotion ]               = useState(INITIAL_STATE);

    const createPromotion                           = async (code: string, startDate: Date | null, endDate: Date | null,  quantity: number, type: number, repeat: number, access_token: string) => {

        if(code && String(quantity) && String(type) && String(repeat) && access_token) {
 
            const response                          = await storePromotion(code, startDate, endDate, Number(quantity), Number(type), Number(repeat), access_token);

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
    const deletePromotion                           = async (id: string, access_token: string) => {
        if(id && access_token) {
            const response                          = await destroyPromotion(id, access_token);

            console.log(response);

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
    const editPromotion                             = async (id: string, code: string, startDate: Date | null, endDate: Date | null,  quantity: number, type: number, repeat: number, access_token: string) => {
        
        if(id && code && String(quantity) && String(type) && String(repeat) && access_token) {
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
    const undeletePromotion                         = async (id: string, access_token: string) => {
        if(id && access_token) {
            const response                          = await restorePromotion(id, access_token);

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
    const showPromotion                             = async (id: string, access_token: string) => {
        if(id && access_token) {
            const response                          = await getPromotion(id, access_token);

            if(response && response.ok) {
                toast.error(response.msg);
            }

            if(response && response.data) {      
                return response.data.promotions;
            }
        }
    }
    const isValidPromotion                          = async (code: string, access_token: string) => {

        const response                              = await getPromotionByCode(code, access_token);

        if(response && response.ok) {
            return response.msg;
        }

        if(response && response.data) {     
            return response.data.promotions;
        }
    }
    const showOrder                                 = async (id: string, access_token: string) => {
        if(id && access_token) {
            const response                          = await getOrder(id, access_token);

            if(response && response.data) {      
                return response.data.orders;
            }
        }
    }
    const isSubscription                            = async (id: string, access_token: string) => {
        if(id && access_token) {
            const response                          = await getSubcription(id, access_token);

            if(response && response.ok) {
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
           promotion,
           createPromotion,
           deletePromotion,
           editPromotion,
           undeletePromotion,
           showPromotion,
           isValidPromotion,
           isSubscription,
           showOrder
          }}
        >
          {children}
        </PromotionContext.Provider>
    );
}