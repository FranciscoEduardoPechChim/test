//Types
import { orderResponse } from '../types/orderType';
//Credentials
import { production, development } from 'credentials';

//POST
export const storeOrder                             = async (userId: string, packageId: string, quantityUsers: number, type: string, paymentDate: string, expirationDate: string, paymentMethod: string, stripePaymentId: string, code: string | null, name: string, access_token: string):Promise<orderResponse | undefined> => {
    try { 
        let body                                    = { 
            userId:                                 userId,
            packageId:                              packageId,
            quantityUsers:                          quantityUsers,
            type:                                   type,
            paymentDate:                            paymentDate,
            expirationDate:                         expirationDate,
            paymentMethod:                          paymentMethod,
            stripePaymentId:                        stripePaymentId,
            code:                                   code,
            name:                                   name
        };

        const requestOptions                        = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body:JSON.stringify(body)
        };

        const response                              = await fetch(`${production}/pedidos`, requestOptions);
        const result:orderResponse                  = await response.json();
            
        return result; 
    }catch(error) {
        console.log('Error: ' + error);
    }
}

//GET
// export const getPromotions                          = async (access_token: string):Promise<promotionResponse|undefined> => {
//     try {
//         var myHeaders                               = new Headers();
//         myHeaders.append("Content-Type", "application/json");
//         myHeaders.append("X-Requested-With", "XMLHttpRequest");
//         myHeaders.append("Authorization", `Bearer ${access_token}`);

//         const requestOptions                        = {
//             method: 'GET',
//             headers: myHeaders
//         };

//         const response                              = await fetch(`${development}/promotions`, requestOptions);
//         const result:promotionResponse              = await response.json();
      
//         return result;
//     } catch (error) {
//         console.log("Error:", error);
//     }
// }
// export const getPromotion                           = async (id: string, access_token: string):Promise<promotionResponse|undefined> => {
//     try {
//         var myHeaders                               = new Headers();
//         myHeaders.append("Content-Type", "application/json");
//         myHeaders.append("X-Requested-With", "XMLHttpRequest");
//         myHeaders.append("Authorization", `Bearer ${access_token}`);

//         const requestOptions                        = {
//             method: 'GET',
//             headers: myHeaders
//         };

//         const response                              = await fetch(`${development}/promotions/${id}`, requestOptions);
//         const result:promotionResponse              = await response.json();
      
//         return result;
//     } catch (error) {
//         console.log("Error:", error);
//     }
// }
// export const restorePromotion                       = async (id: string, access_token: string):Promise<promotionResponse|undefined> => {
//     try {
//         var myHeaders                               = new Headers();
//         myHeaders.append("Content-Type", "application/json");
//         myHeaders.append("X-Requested-With", "XMLHttpRequest");
//         myHeaders.append("Authorization", `Bearer ${access_token}`);

//         const requestOptions                        = {
//             method: 'GET',
//             headers: myHeaders
//         };

//         const response                              = await fetch(`${development}/promotions/restore/${id}`, requestOptions);
//         const result:promotionResponse              = await response.json();
      
//         return result;
//     } catch (error) {
//         console.log("Error:", error);
//     }
// }
// export const getPromotionByCode                     = async (code: string, access_token: string):Promise<promotionResponse|undefined> => {
//     try {
//         var myHeaders                               = new Headers();
//         myHeaders.append("Content-Type", "application/json");
//         myHeaders.append("X-Requested-With", "XMLHttpRequest");
//         myHeaders.append("Authorization", `Bearer ${access_token}`);

//         const requestOptions                        = {
//             method: 'GET',
//             headers: myHeaders
//         };

//         const response                              = await fetch(`${development}/promotions/code/${code}`, requestOptions);
//         const result:promotionResponse              = await response.json();
      
//         return result;
//     } catch (error) {
//         console.log("Error:", error);
//     }
// }

//DELETE
export const destroyOrder                               = async (id: string, access_token:string):Promise<orderResponse|undefined> => {
     try {
        var myHeaders                                   = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        var requestOptions                              = {
            method: 'DELETE',
            headers: myHeaders
        };

        const response                                  = await fetch(`${production}/pedidos/${id}`, requestOptions);
        const result:orderResponse                      = await response.json();
      
        return result;
    } catch (error) {
         console.log("Error:", error);
    }
} 

//UPDATE
// export const updatePromotion                        = async (id: string, code: string, startDate: Date | null, endDate: Date | null, quantity: number, type: number, repeat: number, access_token: string):Promise<promotionResponse | undefined> => {
//     try { 
//         let body                                    = { 
//             id:                                     id,
//             code:                                   code, 
//             startDate:                              (startDate) ? startDate.toISOString().split('T')[0]:null,
//             endDate:                                (endDate) ? endDate.toISOString().split('T')[0]:null,
//             quantity:                               quantity,
//             type:                                   type,
//             repeat:                                 repeat       
//         };
        
//         const requestOptions                        = {
//             method: 'PUT',
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${access_token}`
//             },
//             body:JSON.stringify(body)
//         };

//         const response                              = await fetch(`${development}/promotions/${id}`, requestOptions);
//         const result:promotionResponse              = await response.json();
            
//         return result; 
//     }catch(error) {
//         console.log('Error: ' + error);
//     }
// }

//ACTIONS



