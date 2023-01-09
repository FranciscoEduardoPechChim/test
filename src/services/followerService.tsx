//Types
import { followerResponse } from '../types/followerType';
//Credentials
import { production, development } from 'credentials';

//POST
export const storeFollower                          = async (user: string, owner: string, access_token: string):Promise<followerResponse | undefined> => {
    try { 
        let body                                    = { 
            user:                                   user,
            owner:                                  owner,
            notification:                           true,
            email:                                  true   
        };

        const requestOptions                        = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body:JSON.stringify(body)
        };

        const response                              = await fetch(`${development}/followers`, requestOptions);
        const result:followerResponse               = await response.json();
            
        return result; 
    }catch(error) {
        console.log('Error: ' + error);
    }
}

//GET
export const getFollowerByUser                      = async (id: string, access_token: string):Promise<followerResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        const requestOptions                        = {
            method: 'GET',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/followers/user/${id}`, requestOptions);
        const result:followerResponse               = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}
export const getFollower                            = async (id: string, access_token: string):Promise<followerResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        const requestOptions                        = {
            method: 'GET',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/followers/${id}`, requestOptions);
        const result:followerResponse               = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}
export const getUsersByProperties                   = async (id: string, status: number, access_token: string):Promise<followerResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        const requestOptions                        = {
            method: 'GET',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/followers/properties/${id}/?status=${status}`, requestOptions);
        const result:followerResponse               = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}

//DELETE
export const destroyFollower                        = async (id: string, access_token:string):Promise<followerResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        var requestOptions                          = {
            method: 'DELETE',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/followers/${id}`, requestOptions);
        const result:followerResponse               = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
} 

//UPDATE
export const updateFollower                         = async (id: string, user: string, owner: string, notification: boolean, email: boolean , access_token: string):Promise<followerResponse | undefined> => {
    try { 
        let body                                    = { 
            user:                                   user, 
            owner:                                  owner,
            notification:                           notification,
            email:                                  email
        };
        
        const requestOptions                        = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body:JSON.stringify(body)
        };

        const response                              = await fetch(`${development}/followers/${id}`, requestOptions);
        const result:followerResponse               = await response.json();
            
        return result; 
    }catch(error) {
        console.log('Error: ' + error);
    }
}

//ACTIONS



