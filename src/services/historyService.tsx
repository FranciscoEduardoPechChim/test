//Types
import { historyResponse } from '../types/historyType';
//Credentials
import { development, production } from 'credentials';

//POST
export const storeHistory                           = async (userId: string, propertyId: string, access_token: string):Promise<historyResponse | undefined> => {
    try { 
        let body                                    = { 
            userId:                                userId, 
            propertyId:                            propertyId
        };

        const requestOptions                        = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body:JSON.stringify(body)
        };

        const response                              = await fetch(`${development}/historial`, requestOptions);
        const result:historyResponse                = await response.json();
            
        return result; 
    }catch(error) {
        console.log('Error: ' + error);
    }
}

//GET

//UPDATE

//ACTIONS

