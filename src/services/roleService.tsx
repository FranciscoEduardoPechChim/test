//Types
import { roleResponse } from '../types/roleType';
//Credentials
import { production, development } from 'credentials';

//POST

//GET
export const getRolesWithoutPermissions             = async (id: string, access_token: string):Promise<roleResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        const requestOptions                        = {
            method: 'GET',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/roles/withoutpermissions/${(id)}`, requestOptions);
        const result:roleResponse                   = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}



//DELETE


//UPDATE

//ACTIONS



