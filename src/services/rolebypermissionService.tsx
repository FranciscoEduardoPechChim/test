//Types
import { rolebypermissionResponse, rolebypermissionArrayResponse } from '../types/rolebypermissionType';
//Credentials
import { production, development } from 'credentials';

//POST
export const storeRoleByPermission                  = async (roleId: string, permissionId: string, access_token: string):Promise<rolebypermissionResponse|undefined> => {
    try { 
        let body                                    = { 
            roleId:                                 roleId, 
            permissionId:                           permissionId 
        };

        const requestOptions                        = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body:JSON.stringify(body)
        };

        const response                              = await fetch(`${development}/rolebypermissions`, requestOptions);
        const result:rolebypermissionResponse       = await response.json();
            
        return result; 
    }catch(error) {
        console.log('Error: ' + error);
    }
}
//GET
export const getRoleByPermissions                   = async (access_token: string):Promise<rolebypermissionResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        const requestOptions                        = {
            method: 'GET',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/rolebypermissions`, requestOptions);
        const result:rolebypermissionResponse       = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}
export const getRoleByPermission                    = async (id: string, access_token: string):Promise<rolebypermissionResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        const requestOptions                        = {
            method: 'GET',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/rolebypermissions/${id}`, requestOptions);
        const result:rolebypermissionResponse       = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}
export const hasPermission                          = async (roleId: string, access_token: string):Promise<rolebypermissionArrayResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        const requestOptions                        = {
            method: 'GET',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/rolebypermissions/valid/${roleId}`, requestOptions);
        const result:rolebypermissionArrayResponse  = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}
export const restoreRoleByPermission                = async (id: string, access_token: string):Promise<rolebypermissionResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        const requestOptions                        = {
            method: 'GET',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/rolebypermissions/restore/${id}`, requestOptions);
        const result:rolebypermissionResponse       = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}
//DELETE
export const destroyRoleByPermission                = async (id: string, access_token:string):Promise<rolebypermissionResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        var requestOptions                          = {
            method: 'DELETE',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/rolebypermissions/${id}`, requestOptions);
        const result:rolebypermissionResponse       = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
} 

//UPDATE
export const updateRoleByPermission                 = async (id: string, roleId: string, permissionId: string, access_token: string):Promise<rolebypermissionResponse|undefined> => {
    try { 
        let body                                    = { 
            id:                                     id,
            roleId:                                 roleId, 
            permissionId:                           permissionId  
        };
        
        const requestOptions                        = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body:JSON.stringify(body)
        };

        const response                              = await fetch(`${development}/rolebypermissions/${id}`, requestOptions);
        const result:rolebypermissionResponse       = await response.json();
            
        return result; 
    }catch(error) {
        console.log('Error: ' + error);
    }
}

//ACTIONS



