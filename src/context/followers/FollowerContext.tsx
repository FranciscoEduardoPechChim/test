//React
import { createContext, Dispatch, FC, SetStateAction, useCallback, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
//Helpers
import { validate } from '../../helpers/response';
//Interfaces
import { Follower } from '../../interfaces/FollowerInterface';
//Services
import { storeFollower, getFollower, updateFollower, destroyFollower } from '../../services/followerService';
//Extras
import Swal from "sweetalert2";

interface ContextProps {
    follower:           Follower;
    createFollower:     (user: string, owner: string, access_token: string) => Promise<boolean | undefined>;
    editFollower:       (id: string, user: string, owner: string, notification: boolean, email: boolean, access_token: string) => Promise<boolean | undefined>;
    deleteFollower:     (id: string, access_token: string) => Promise<boolean | undefined>;
    showFollower:       (id: string, access_token: string) => Promise<Follower | undefined>;
}

export const FollowerContext                        = createContext({} as ContextProps);

const INITIAL_STATE: Follower                       = {
    user:                                           undefined,
    owner:                                          undefined,
    notification:                                   true,
    email:                                          true
};

export const FollowerProvider: FC                   = ({ children }) => {
    const [ follower, setFollower ]                 = useState(INITIAL_STATE);

    const createFollower                            = async (user: string, owner: string, access_token: string) => {

        if(user && owner && access_token) {
            const response                          = await storeFollower(user, owner, access_token);

            if(response && response.errors) {
                validate(response.errors);
                return false;
            }

            if(response && response.ok) {
                toast.error(response.msg);
                return false;
            }

            if(response && response.data) {
                const { data }                      = response;
            
                setFollower(data.followers[0]);

                Swal.fire({
                    title: '',
                    html: response.msg,
                    icon: 'success',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });
                  
                return true;
            }
        }

        return false;
    }
    const deleteFollower                            = async (id: string, access_token: string) => {
        if(id && access_token) {
            const response                          = await destroyFollower(id, access_token);

            if(response && response.ok) {
                toast.error(response.msg);
                return false;
            }

            if(response && response.data) {      

                Swal.fire({
                    title: '',
                    html: response.msg,
                    icon: 'success',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });

                return true;
            }

        }

        return false;
    }
    const editFollower                              = async (id: string, user: string,  owner: string, notification: boolean, email: boolean, access_token: string) => {
        if(id && user && owner && access_token) {
            const response                          = await updateFollower(id, owner, user, notification, email, access_token);

            if(response && response.errors) {
                validate(response.errors);
                return false;
            }

            if(response && response.ok) {
                toast.error(response.msg);
                return false;
            }

            if(response && response.data) {
                const { data }                      = response;
            
                setFollower(data.followers[0]);
                       
                Swal.fire({
                    title: '',
                    html: response.msg,
                    icon: 'success',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });

                return true;
            }
        }

        return false;
    }
    const showFollower                              = async (id: string, access_token: string) => {
        if(id && access_token) {
            const response                          = await getFollower(id, access_token);

            if(response && response.ok) {
                toast.error(response.msg);
            }

            if(response && response.data) {      
                return response.data.followers[0];
            }
        }
    }
  
    return (
        <FollowerContext.Provider
          value={{
           follower,
           createFollower,
           deleteFollower,
           editFollower,
           showFollower
          }}
        >
          {children}
        </FollowerContext.Provider>
    );
}