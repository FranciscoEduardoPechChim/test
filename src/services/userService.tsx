//Types
import { userResponse } from '../types/userType';
//Credentials
import { production, development } from 'credentials';

//POST
export const storeUser                          = async (name: string, lastName: string, email: string, password: string, confirmPassword: string, ownerId: string, access_token: string):Promise<userResponse | undefined> => {
    try {
        let body                                = { 
            name:                               name,
            lastName:                           lastName,
            email:                              email, 
            password:                           password,
            confirmPassword:                    confirmPassword,
            ownerId:                            ownerId
        };

        const requestOptions                    = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body:JSON.stringify(body)
        };

        const response                          = await fetch(`${development}/usuarios/create`, requestOptions);
        const result:userResponse               = await response.json();
            
        return result; 
    }catch(error) {
        console.log('Error: ' + error);
    }
}

//GET
export const showUsersByOwner                   = async (id:string, access_token:string):Promise<userResponse|undefined> => {
    try {
        var myHeaders                           = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        var requestOptions                      = {
            method: 'GET',
            headers: myHeaders
        };

        const response                          = await fetch(`${development}/usuarios/owner/${id}`, requestOptions);
        const result:userResponse               = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}
export const showUser                           = async (id:string, access_token:string):Promise<userResponse|undefined> => {
    try {
        var myHeaders                           = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        var requestOptions                      = {
            method: 'GET',
            headers: myHeaders
        };

        const response                          = await fetch(`${development}/usuarios/userpayment/${id}`, requestOptions);
        const result:userResponse               = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}

//DELETE
export const destroyUser                        = async (id: string, changeId: string, access_token:string):Promise<userResponse|undefined> => {
    try {
        var myHeaders                           = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        var requestOptions                      = {
            method: 'DELETE',
            headers: myHeaders
        };

        const response                          = await fetch(`${development}/usuarios/userpayment/${id}/${changeId}`, requestOptions);
        const result:userResponse               = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
} 
//UPDATE
export const updateUser                         = async (id: string, name: string, lastName: string, email: string, password: string, confirmPassword: string, access_token: string):Promise<userResponse | undefined> => {
    try { 
        let body                                = { 
            id:                                 id,
            name:                               name,
            lastName:                           lastName,
            email:                              email, 
            password:                           (password != '') ? password:null,
            confirmPassword:                    (confirmPassword != '') ? confirmPassword:null
        };
        
        const requestOptions                    = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body:JSON.stringify(body)
        };

        const response                          = await fetch(`${development}/usuarios/userpayment/${id}`, requestOptions);
        const result:userResponse               = await response.json();
            
        return result; 
    }catch(error) {
        console.log('Error: ' + error);
    }
}

//ACTIONS



