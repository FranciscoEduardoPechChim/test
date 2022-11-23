//Types
import { propertyResponse } from '../types/propertyType';
//Credentials
import { production, development } from 'credentials';

//POST

//GET
export const getPropertiesByUser                    = async (id: string, limit: number, offset: number, order: string, user: string, access_token: string):Promise<propertyResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        const requestOptions                        = {
            method: 'GET',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/inmuebles/user/${id}?limit=${limit}&offset=${offset}&order=${order}&userId=${user}`, requestOptions);
        const result:propertyResponse               = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}
export const getPropertiesByCoords                  = async (lat_south_east: number, lng_south_east: number, lat_south_west: number, lng_south_west: number, lat_north_east: number, lng_north_east: number, lat_north_west: number, lng_north_west: number, category: string, type: string):Promise<propertyResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");

        const requestOptions                        = {
            method: 'GET',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/inmuebles/properties/coords?lat_south_east=${lat_south_east}&lng_south_east=${lng_south_east}&lat_south_west=${lat_south_west}&lng_south_west=${lng_south_west}&lat_north_east=${lat_north_east}&lng_north_east=${lng_north_east}&lat_north_west=${lat_north_west}&lng_north_west=${lng_north_west}&category=${category}&type=${type}`, requestOptions);
        const result:propertyResponse               = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}
export const getPropertyByURL                       = async (id: string):Promise<propertyResponse|undefined> => {
    try {
        var myHeaders                               = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");

        const requestOptions                        = {
            method: 'GET',
            headers: myHeaders
        };

        const response                              = await fetch(`${development}/inmuebles/url/${id}`, requestOptions);
        const result:propertyResponse               = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}

//DELETE

//UPDATE
export const updatePropertyByAlias                  = async (id: string, alias: string, access_token: string):Promise<propertyResponse|undefined> => {
    try { 
        let body                                    = { 
            alias:                                  alias
        };
        
        const requestOptions                        = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body:JSON.stringify(body)
        };

        const response                              = await fetch(`${development}/inmuebles/url/alias/${id}`, requestOptions);
        const result:propertyResponse               = await response.json();
            
        return result; 
    }catch(error) {
        console.log('Error: ' + error);
    }
}

//ACTIONS



