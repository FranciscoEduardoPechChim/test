//Types
import { requestResponse } from '../types/requestType';
//Credentials
import { production, development } from 'credentials';

//POST
export const requestProperty                        = async (user: string, owner: string, property: string, state: string, access_token: string):Promise<requestResponse|undefined> => {
    try {   
        let body                                    = { 
            user:                                   user,
            owner:                                  owner,
            property:                               property,
            state:                                  state
        };

        const requestOptions                        = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body:JSON.stringify(body)
        };

        const response                              = await fetch(`${development}/solicitud`, requestOptions);
        const result:requestResponse                = await response.json();
            
        return result; 
    }catch(error) {
        console.log('Error: ' + error);
    }
}

//GET

//DELETE

//UPDATE

//ACTIONS



