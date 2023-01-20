//Types
import { userResponse, profileResponse} from '../types/userType';
//Credentials
import { production, development } from 'credentials';
//Extra
import dayjs, { Dayjs } from 'dayjs';

//POSTs
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
export const showUsers                          = async (offset: number, limit: number, startDate: Dayjs | null, endDate: Dayjs | null, access_token:string):Promise<userResponse|undefined> => {
    try {
        var myHeaders                           = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        var requestOptions                      = {
            method: 'GET',
            headers: myHeaders
        };

        const start                             = (startDate) ? (new Date(startDate.format('YYYY-MM-DD')).toISOString()).split('T')[0]: '0';
        const end                               = (endDate) ? (new Date(endDate.format('YYYY-MM-DD')).toISOString()).split('T')[0]: '0';

        const response                          = await fetch(`${development}/usuarios?offset=${offset}&limit=${limit}&startDate=${start}&endDate=${end}`, requestOptions);
        const result:userResponse               = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}

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
export const showWithoutUser                    = async (id: string):Promise<userResponse|undefined> => {
    try {
        var myHeaders                           = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");

        var requestOptions                      = {
            method: 'GET',
            headers: myHeaders
        };

        const response                          = await fetch(`${development}/usuarios/userwithoutpayment/${id}`, requestOptions);
        const result:userResponse               = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}
export const showRealEstate                     = async (lat_south_east: number, lng_south_east: number, lat_south_west: number, lng_south_west: number, lat_north_east: number, lng_north_east: number, lat_north_west: number, lng_north_west: number):Promise<userResponse|undefined> => {
    try {
        var myHeaders                           = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");

        var requestOptions                      = {
            method: 'GET',
            headers: myHeaders
        };

        const response                          = await fetch(`${development}/usuarios/test/realestate?lat_south_east=${lat_south_east}&lng_south_east=${lng_south_east}&lat_south_west=${lat_south_west}&lng_south_west=${lng_south_west}&lat_north_east=${lat_north_east}&lng_north_east=${lng_north_east}&lat_north_west=${lat_north_west}&lng_north_west=${lng_north_west}`, requestOptions);
        const result:userResponse               = await response.json();
      
        return result;
    } catch (error) {
        console.log("Error:", error);
    }
}

//DELETE
export const destroyChangeUser                  = async (id: string, changeId: string, access_token:string):Promise<userResponse|undefined> => {
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
export const destroyUser                        = async (id: string, access_token:string):Promise<userResponse|undefined> => {
    try {
        var myHeaders                           = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        var requestOptions                      = {
            method: 'DELETE',
            headers: myHeaders
        };

        const response                          = await fetch(`${development}/usuarios/userpayment/${id}`, requestOptions);
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
export const updateProfile                      = async (id: string, name: string, profileCompany: string | null, phone: number | null, officePhone: number | null, lastName: string, companyName: string | null, 
    companyLocation: string, companyLat: number, companyLng: number, website: string | null, facebook: string | null, instagram: string | null, twitter: string | null, youtube: string | null,
    linkedin: string | null, isZone: boolean, nameZone: string | null, latZone: string | null, lngZone: string | null, rangeZone: string | null, categoryZone: string | null, typeZone: string | null, roomsZone: string | null,
    bathsZone: string | null, garagesZone: string | null, minPriceZone: string | null, maxPriceZone: string | null, minGroundZone: string | null, maxGroundZone: string | null, setZone: string | null, minBuildZone: string | null,
    maxBuildZone: string | null, isLocation:boolean, showModalPassword: boolean, password: string, confirmPassword: string, access_token: string):Promise<profileResponse | undefined> => {
    try { 
        let body                                = { 
            user:                               id,
            name:                               name,
            lastName:                           lastName,
            profileCompany:                     profileCompany,
            phone:                              phone,
            officePhone:                        officePhone,
            companyName:                        companyName,
            companyLocation:                    companyLocation,
            companyLat:                         companyLat,
            companyLng:                         companyLng,
            website:                            website,
            facebook:                           facebook,
            instagram:                          instagram,
            twitter:                            twitter,
            youtube:                            youtube,
            linkedin:                           linkedin,
            isZone:                             isZone,
            nameZone:                           nameZone,
            latZone:                            latZone,
            lngZone:                            lngZone,
            rangeZone:                          rangeZone,
            categoryZone:                       categoryZone,
            typeZone:                           typeZone,
            roomsZone:                          roomsZone,
            bathsZone:                          bathsZone,
            garagesZone:                        garagesZone,
            minPriceZone:                       minPriceZone,
            maxPriceZone:                       maxPriceZone,
            minGroundZone:                      minGroundZone,
            maxGroundZone:                      maxGroundZone,
            setZone:                            setZone,
            minBuildZone:                       minBuildZone,
            maxBuildZone:                       maxBuildZone,
            isLocation:                         isLocation,
            showModalPassword:                  showModalPassword,
            password:                           showModalPassword ? password:null,
            confirmPassword:                    showModalPassword ? confirmPassword:null
        };
        
        const requestOptions                    = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body:JSON.stringify(body)
        };

        const response                          = await fetch(`${development}/usuarios/profile/${id}`, requestOptions);
        const result:profileResponse            = await response.json();
            
        return result; 
    }catch(error) {
        console.log('Error: ' + error);
    }
}

//ACTIONS



