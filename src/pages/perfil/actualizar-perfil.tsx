import { useContext, useEffect } from "react";
import { useRouter} from "next/router";
import ActualizarPerfilForm from "../../components/paginas/perfil/perfil/ActualizarPerfil";
import SEO from "../../components/seo/SEO";
import { PrivateRoute } from "../../hooks/usePrivateRoute";

//Context
import { AuthContext } from "context/auth/AuthContext";
//Hooks
import { useLocationByEmail } from '../../hooks/useLocationByEmail';
//Components
import NotFound from "../404";

const ActualizarPerfil                                = () => {
  const access_token                                  = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
  const { asPath }                                    = useRouter();
  const { auth }                                      = useContext(AuthContext);
  const {loadingLocationByEmail, locationEmailArray,
  setArray, priceArray, groundArray, buildArray, 
  rangeArray, bathsArray, garagesArray, roomsArray,
  categoryArray, typeArray, init }                    = useLocationByEmail((auth && auth.uid) ? auth.uid:'', (access_token) ? access_token:'')


  useEffect(() => {
    init();
  }, [auth]);

  if(loadingLocationByEmail) {
    return <NotFound />;
  }

  return (
    <>
      <SEO titulo="Actualiza tu perfil" url={asPath} />
      <ActualizarPerfilForm 
        auth                = {auth}
        locationEmailArray  = {locationEmailArray}
        setArray            = {setArray}
        priceArray          = {priceArray}
        groundArray         = {groundArray}
        buildArray          = {buildArray}
        rangeArray          = {rangeArray}
        bathsArray          = {bathsArray}
        garagesArray        = {garagesArray}
        roomsArray          = {roomsArray}
        categoryArray       = {categoryArray}
        typeArray           = {typeArray}
      />
    </>
  );
};

export default PrivateRoute(ActualizarPerfil);
