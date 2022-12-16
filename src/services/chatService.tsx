//Types
import { chatResponse } from '../types/chatType';
//Credentials
import { development, production } from 'credentials';

//POST
export const storeChat                              = async (from: string, to: string, access_token: string):Promise<chatResponse | undefined> => {
    try { 
        let body                                    = { 
            from:                                   from, 
            to:                                     to
        };

        const requestOptions                        = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body:JSON.stringify(body)
        };

        const response                              = await fetch(`${development}/chats`, requestOptions);
        const result:chatResponse                   = await response.json();
            
        return result; 
    }catch(error) {
        console.log('Error: ' + error);
    }
}

//GET

//UPDATE

//ACTIONS

