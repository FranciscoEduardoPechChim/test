//React
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
//Components
import AnadirInmueble from "../../../components/paginas/perfil/propiedades/AnadirInmueble";
import SEO from "../../../components/seo/SEO";
import Home from "../../index";
//Hooks
import { PrivateRoute } from "../../../hooks/usePrivateRoute";
//Context
import { InmuebleContext } from "context/inmuebles/InmuebleContext";
//Extras

const EditProperty                = () => {
    const access_token            = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
    const router                  = useRouter();
    const [property, setProperty] = useState<any>(null);
    const { pid }                 = router.query;
    const { showProperty }        = useContext(InmuebleContext)
    
    const init                    = async () => {
      if(pid && (typeof pid == 'string') && access_token) {
        const response            = await showProperty(pid, access_token);

        if(response) {
          setProperty(response);
        }
      }
    }

    useEffect(() => {
      init();
    }, [pid]);

    return (
      <>
        <SEO titulo="Editar inmueble" url={router.asPath} />
        {(property) ? <AnadirInmueble action={'update'} data={property} />:<Home />}
      </>
    );
}

export default PrivateRoute(EditProperty);