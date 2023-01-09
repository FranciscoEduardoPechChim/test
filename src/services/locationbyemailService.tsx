//Types
import { locationbyemailResponse } from '../types/locationbyemailType';
//Credentials
import { production, development } from 'credentials';

//POST

//GET
export const getLocationByEmailAndUser              = async (id: string, access_token: string):Promise<locationbyemailResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        const requestOptions                        = {
            method: 'GET',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/locationbyemails/${id}`, requestOptions);
        const result:locationbyemailResponse        = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}

//DELETE

//UPDATE

//ACTIONS



