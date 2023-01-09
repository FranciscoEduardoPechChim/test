//Types
import { favoriteResponse } from '../types/favoriteType';
//Credentials
import { production, development } from 'credentials';

//POST
export const storeFavorite                       = async (user: string, owner: string, property: string, access_token: string):Promise<favoriteResponse|undefined> => {
    try {   
        let body                                    = { 
            user:                                   user,
            owner:                                  owner,
            property:                               property
        };

        const requestOptions                        = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body:JSON.stringify(body)
        };

        const response                              = await fetch(`${development}/favoritos`, requestOptions);
        const result:favoriteResponse               = await response.json();
            
        return result; 
    }catch(error) {
        console.log('Error: ' + error);
    }
}

//GET

//DELETE
export const destroyFavorite                     = async (id: string, owner: string, property: string, access_token:string):Promise<favoriteResponse|undefined> => {
    try {
        var myHeaders                            = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        var requestOptions                          = {
            method: 'DELETE',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/favoritos/${id}/?ownerId=${owner}&propertyId=${property}`, requestOptions);
        const result:favoriteResponse               = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
} 

//UPDATE

//ACTIONS



