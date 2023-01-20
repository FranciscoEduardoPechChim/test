//React
import { useEffect, useState } from "react";
//Services
import { getFollowerByUser } from '../services/followerService';

export const useFollowers                       = (id: string, access_token: string) => {
    const [followers, setFollowers]             = useState<any>([]);
    const [followme, setFollowme]               = useState<any>([]);
    const [loading, setLoading]                 = useState(false);

    const init                                  = async () => {
        if(id && access_token) {
            setLoading(true);

            const response                      = await getFollowerByUser(id, access_token);

            if(response && response.data) {
                setFollowme(response.data.followme);
                setFollowers(response.data.followers);
            }

            setLoading(false);
        }
    }

    useEffect(() => {
        init();
    }, [id]);
   
    return  {
        loading:                        loading,
        followers:                      followers,
        followme:                       followme,
        init:                           init
    }
}


  