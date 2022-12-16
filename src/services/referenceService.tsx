//Types
import { referenceResponse } from '../types/referenceType';
import { ReferenciaNumero } from "../interfaces/ReferenciasInterface";
//Credentials
import { production, development } from 'credentials';

//POST
export const storeReference                     = async (userId: string, packageId: string, reference: string, price: number, imports: number, totalUser: number, state: boolean, isOxxo: boolean, access_token: string):Promise<referenceResponse | undefined> => {
    try { 
        let body                                    = { 
            userId:                                 userId, 
            packageId:                              packageId,
            reference:                              reference, 
            price:                                  price,
            imports:                                imports,
            totalUser:                              totalUser,
            state:                                  state,
            isOxxo:                                 isOxxo
        };

        const requestOptions                        = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body:JSON.stringify(body)
        };

        const response                              = await fetch(`${development}/referencias`, requestOptions);
        const result:referenceResponse              = await response.json();
            
        return result; 
    }catch(error) {
        console.log('Error: ' + error);
    }
}
export const loadImages                         = async (images: any, uid: string, rid: string, access_token: string):Promise<referenceResponse | undefined> => {    
    try {
        const formData                          = new FormData();
        formData.append("comprobante", images);
        formData.set("uid", uid);
        formData.set("rid", rid);
        
        const requestOptions                    = {
            method: 'POST',
            headers: {
                "Accept": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${access_token}`
            },
            body: formData
        };

        const response                          = await fetch(`${development}/subidas/comprobante/${uid}/${rid}`, requestOptions);
        const result:referenceResponse          = await response.json();
                
        return result;     

    }catch (error) {
        console.log(error);
    }
}

//GET
export const showReference                      = async (id: string):Promise<referenceResponse | undefined>=> {
    try {
        var myHeaders                           = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        
        const requestOptions                    = {
            method: 'GET',
            headers: myHeaders
        };

        const response                          = await fetch(`${development}/referencias/${id}`, requestOptions);
        const result:referenceResponse          = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}

export const downloadPDF                        = async (id: string)  => {
    try {
        const requestOptions                    = {
            method: 'GET',
            responseType: 'pdf'
        };

        const response                          = await fetch(`${development}/referencias/download/${id}`, requestOptions);
    
        return response;
    } catch (error) {
        console.log("Error:", error);
    }
}

//DELETE
export const deleteImages                       = async (rid: string, access_token: string):Promise<referenceResponse | undefined> => {
    try {
        var myHeaders                           = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        var requestOptions                      = {
            method: 'DELETE',
            headers: myHeaders
        };
       
        const response                          = await fetch(`${development}/subidas/comprobante/${rid}`, requestOptions);
        const result:referenceResponse          = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}

//UPDATE
export const updateAuthorization                = async (id: string, authorization: number, referencesOrTicket: number, type:string, access_token: string):Promise<referenceResponse | undefined> => {
    try { 
        let body                                = (type == 'create') ? { 
            authorizations:                     authorization,
            referencesAndTicket:                referencesOrTicket 
        }:{ 
            id:                                 id,
            authorizations:                     authorization,
            referencesAndTicket:                referencesOrTicket 
        };
        
        const requestOptions                    = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body:JSON.stringify(body)
        };

        const response                          = await fetch(`${development}/referencias/autorization/${id}`, requestOptions);
        const result:referenceResponse          = await response.json();
            
        return result; 
    }catch(error) {
        console.log('Error: ' + error);
    }
}

//ACTIONS



