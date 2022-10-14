//Types
import { loginResponse, recoveryPassword } from '../types/authType';
//Credentials
import { development, production } from 'credentials';

//POST
export const session                            = async (email:string, password: string):Promise<loginResponse | undefined> => {
    try {
        let body                                = { 
            email:                              email, 
            password:                           password
        };

        const requestOptions                    = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify(body)
        };
        
        const response                          = await fetch(`${development}/auth/login`, requestOptions);
        const result:loginResponse              = await response.json();
            
        return result; 
    }catch(error) {
        console.log('Error: ' + error);
    }
}
export const signup                             = async (name: string, lastName: string, email: string, password: string, role: string):Promise<loginResponse | undefined> => {
    try {
        let body                                = { 
            name:                               name,
            lastName:                           lastName,
            email:                              email, 
            password:                           password,
            role:                               role
        };

        const requestOptions                    = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify(body)
        };
        
        const response                          = await fetch(`${development}/usuarios`, requestOptions);
        const result:loginResponse              = await response.json();
            
        return result; 
    }catch(error) {
        console.log('Error: ' + error);
    }
}

//GET
export const confirmForgotPassword              = async (id: string | string[] | undefined, token: string | string[] | undefined):Promise<recoveryPassword|undefined> => {
    try {
        var myHeaders                           = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");

        const requestOptions                      = {
            method: 'GET',
            headers: myHeaders
        };

        const response                          = await fetch(`${development}/auth/confirmPassword/${id}/${token}`, requestOptions);
        const result:recoveryPassword           = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}

// //DELETE

//UPDATE
export const sendPassword                       = async (email: string):Promise<recoveryPassword | undefined> => {
    try {
        let body                                = { 
            email:                              email
        };
     
        const requestOptions                    = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify(body)
        };
        
        const response                          = await fetch(`${development}/auth/recoveryPassword`, requestOptions);
        const result:recoveryPassword           = await response.json();
            
        return result; 
    }catch(error) {
        console.log('Error: ' + error);
    }
}

//ACTIONS



