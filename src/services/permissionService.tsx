//Types
import { permissionResponse } from '../types/permissionType';
//Credentials
import { production, development } from 'credentials';

//POST
export const storePermission                        = async (name: string, label: string, description: string | null, access_token: string):Promise<permissionResponse | undefined> => {
    try { 
        let body                                    = { 
            name:                                   name, 
            label:                                  label,
            description:                            description,   
        };

        const requestOptions                        = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body:JSON.stringify(body)
        };

        const response                              = await fetch(`${development}/permissions`, requestOptions);
        const result:permissionResponse             = await response.json();
            
        return result; 
    }catch(error) {
        console.log('Error: ' + error);
    }
}

//GET
export const getPermissions                         = async (access_token: string):Promise<permissionResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        const requestOptions                        = {
            method: 'GET',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/permissions`, requestOptions);
        const result:permissionResponse             = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}
export const getPermission                          = async (id: string, access_token: string):Promise<permissionResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        const requestOptions                        = {
            method: 'GET',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/permissions/${id}`, requestOptions);
        const result:permissionResponse             = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}
export const restorePermission                      = async (id: string, access_token: string):Promise<permissionResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        const requestOptions                        = {
            method: 'GET',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/permissions/restore/${id}`, requestOptions);
        const result:permissionResponse             = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}
export const getPermissionByRole                    = async (id: string, access_token: string):Promise<permissionResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        const requestOptions                        = {
            method: 'GET',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/permissions/byrole/${id}`, requestOptions);
        const result:permissionResponse             = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}

//DELETE
export const destroyPermission                      = async (id: string, access_token:string):Promise<permissionResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        var requestOptions                          = {
            method: 'DELETE',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/permissions/${id}`, requestOptions);
        const result:permissionResponse             = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
} 

//UPDATE
export const updatePermission                       = async (id: string, name: string, label: string, description: string | null, access_token: string):Promise<permissionResponse | undefined> => {
    try { 
        let body                                    = { 
            id:                                     id,
            name:                                   name, 
            label:                                  label,
            description:                            description,   
        };
        
        const requestOptions                        = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body:JSON.stringify(body)
        };

        const response                              = await fetch(`${development}/permissions/${id}`, requestOptions);
        const result:permissionResponse             = await response.json();
            
        return result; 
    }catch(error) {
        console.log('Error: ' + error);
    }
}

//ACTIONS



