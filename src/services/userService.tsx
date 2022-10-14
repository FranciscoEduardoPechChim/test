//Interfaces
import { Auth } from '../interfaces/AuthInterface';
//Credentials
import { production } from 'credentials';

//POST
// export const storeUser                          = async (access_token: string):Promise<Auth|undefined> => {
//     try {
//         let body                                = new FormData();
//         body.append("correo",                   );
//         body.append("password",                 location_id);

//         const requestOptions                    = {
//             method: 'POST',
//             headers: {
//                 "Content-Type": "multipart/form-data",
//                 "Accept": "application/json",
//                 "Authorization": `Bearer ${access_token}`
//             },
//             body: body
//         };
    
//         const response                          = await fetch(`${production}/auth/login`, requestOptions);
//         const result:Auth                       = await response.json();

//         return result;
//     } catch (error) {
//         console.log("Error:", error);
//     }
// }
 
//GET
// export const getUsers                           = async (access_token:string):Promise<AppointmentResponse|undefined> => {
//     try {
//         var myHeaders                           = new Headers();
//         myHeaders.append("Content-Type", "application/json");
//         myHeaders.append("X-Requested-With", "XMLHttpRequest");
//         myHeaders.append("Authorization", `Bearer ${access_token}`);

//         var requestOptions                      = {
//             method: 'GET',
//             headers: myHeaders,
//             redirect: 'follow'
//         };

//         const response                          = await fetch(`${URL}/api/appointments/${hash}`, requestOptions);
//         const result:AppointmentResponse        = await response.json();
      
//         return result;
//     } catch (error) {
//         console.log("Error:", error);
//     }
// }

// //DELETE

// //UPDATE

//ACTIONS



