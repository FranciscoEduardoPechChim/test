//Types
import { requestResponse } from '../types/requestType';
import { isPropertiesResponse  } from '../types/requestType';
//Credentials
import { production, development } from 'credentials';

//POST
export const requestProperty                        = async (user: string, owner: string, property: string, status: string, access_token: string):Promise<requestResponse|undefined> => {
    try {   
        let body                                    = { 
            user:                                   user,
            owner:                                  owner,
            property:                               property,
            status:                                 status
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
export const getRequests                            = async (owner:string, status: string, access_token: string):Promise<requestResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        const requestOptions                        = {
            method: 'GET',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/solicitud/owner/${owner}/?&status=${status}`, requestOptions);
        const result:requestResponse                = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}
export const getIsProperties                        = async (id: string, access_token: string):Promise<isPropertiesResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        const requestOptions                        = {
            method: 'GET',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/followers/user/property/${id}`, requestOptions);
        const result:isPropertiesResponse           = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}
export const getRequestSlugAndAuth                  = async (id: string, slug: string, access_token: string):Promise<requestResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        const requestOptions                        = {
            method: 'GET',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/solicitud/url/alias/${slug}/${id}`, requestOptions);
        const result:requestResponse                = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}

//DELETE
export const destroyRequest                         = async (properyId: string, userId: string, access_token: string):Promise<requestResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        var requestOptions                          = {
            method: 'DELETE',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/solicitud/${userId}/${properyId}`, requestOptions);
        const result:requestResponse                = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}

//UPDATE
export const requestStatusProperty                  = async (id: string, status: string, access_token: string):Promise<requestResponse|undefined> => {
    try {   
        let body                                    = { 
            requestId:                              id,
            status:                                 status
        };

        const requestOptions                        = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body:JSON.stringify(body)
        };

        const response                              = await fetch(`${development}/solicitud/status/${id}`, requestOptions);
        const result:requestResponse                = await response.json();
            
        return result; 
    }catch(error) {
        console.log('Error: ' + error);
    }
}
export const updateIsProperties                     = async (id: string, isValid: boolean, access_token: string):Promise<isPropertiesResponse|undefined> => {
    try {   
        let body                                    = { 
            isValid:                                isValid
        };

        const requestOptions                        = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body:JSON.stringify(body)
        };

        const response                              = await fetch(`${development}/solicitud/isproperties/${id}`, requestOptions);
        const result:isPropertiesResponse           = await response.json();
            
        return result; 
    }catch(error) {
        console.log('Error: ' + error);
    }
}

//ACTIONS



