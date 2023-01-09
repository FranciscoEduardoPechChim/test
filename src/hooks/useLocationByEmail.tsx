//React
import { useEffect, useState } from "react";
//Services
import { getLocationByEmailAndUser} from '../services/locationbyemailService';

export const useLocationByEmail                             = (id: string, access_token: string) => {
    const [locationByEmail, setLocationByEmail]             = useState<any>([]);
    const [locationEmailArray, setLocationEmailArray]       = useState<any>([]);
    const [setArray, setSetArray]                           = useState<any>([]);
    const [priceArray, setPriceArray]                       = useState<any>([]);
    const [groundArray, setGroundArray]                     = useState<any>([]);
    const [buildArray, setBuildArray]                       = useState<any>([]);
    const [rangeArray, setRangeArray]                       = useState<any>([]);
    const [bathsArray, setBathsArray]                       = useState<any>([]);
    const [garagesArray, setGaragesArray]                   = useState<any>([]);
    const [roomsArray, setRoomsArray]                       = useState<any>([]);
    const [categoryArray, setCategoryArray]                 = useState<any>([]);
    const [typeArray, setTypeArray]                         = useState<any>([]);
    const [loading, setLoading]                             = useState(false);

    const init                                              = async () => {
        if(id && access_token) {
            setLoading(true);

            const response                                  = await getLocationByEmailAndUser(id, access_token);

            if(response && response.data) {
                const { locationbyemails }                  = response.data;

                const currentLocationEmails                 = locationbyemails.map((item:any) => {
                    return {label: item.name, location: { lat: item.lat, lng: item.lng}};
                });

                const currentSets                           = locationbyemails.map((item:any) => {
                    return (item.sets) ? item.sets._id:'all';
                });
                
                const currentPrices                         = locationbyemails.map((item:any) => {
                    return {min: item.minPrice, max: item.maxPrice};
                });

                const currentGrounds                        = locationbyemails.map((item:any) => {
                    return {min: item.minGround, max: item.maxGround};
                });

                const currentBuilds                         = locationbyemails.map((item:any) => {
                    return {min: item.minBuild, max: item.maxBuild};
                });

                const currentRanges                         = locationbyemails.map((item:any) => {
                    return item.range;
                });

                const currentBaths                          = locationbyemails.map((item:any) => {
                    return item.baths;
                });
            
                const currentGarages                        = locationbyemails.map((item:any) => {
                    return item.garages;
                });

                const currentRooms                          = locationbyemails.map((item:any) => {
                    return item.rooms;
                });

                const currentCategories                     = locationbyemails.map((item:any) => {
                    return item.category._id;
                });

                const currentTypes                          = locationbyemails.map((item:any) => {
                    return item.type._id;
                });
     
                setLocationEmailArray(currentLocationEmails);
                setSetArray(currentSets);
                setPriceArray(currentPrices);
                setGroundArray(currentGrounds);
                setBuildArray(currentBuilds);
                setRangeArray(currentRanges);
                setBathsArray(currentBaths);
                setGaragesArray(currentGarages);
                setRoomsArray(currentRooms);
                setCategoryArray(currentCategories);
                setTypeArray(currentTypes);
                setLocationByEmail(locationbyemails);
            }

            setLoading(false);
        }
    }

    useEffect(() => {
        init();
    }, [id]);
   
    return  {
        loadingLocationByEmail:         loading,
        locationByEmail:                locationByEmail,
        locationEmailArray:             locationEmailArray,
        setArray:                       setArray,
        priceArray:                     priceArray,
        groundArray:                    groundArray,
        buildArray:                     buildArray,
        rangeArray:                     rangeArray,
        bathsArray:                     bathsArray,
        garagesArray:                   garagesArray,
        roomsArray:                     roomsArray,
        categoryArray:                  categoryArray,
        typeArray:                      typeArray,
        init:                           init
    }
}


  