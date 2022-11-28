//Types
import { setResponse } from '../types/setType';
//Credentials
import { production, development } from 'credentials';

//POST

//GET
export const getSets                                = async (access_token: string):Promise<setResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        const requestOptions                        = {
            method: 'GET',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/conjuntos`, requestOptions);
        const result:setResponse                    = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}

//DELETE

//UPDATE

//ACTIONS



