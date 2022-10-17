import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import FiltroPropiedades from "../../components/paginas/perfil/propiedades/FiltroPropiedades";
import MiListaPropiedades from "../../components/paginas/perfil/propiedades/MisPropiedades";
import SEO from "../../components/seo/SEO";
import Titulo from "../../components/ui/titulo/Titulo";
import { PrivateRoute } from "../../hooks/usePrivateRoute";
import { AuthContext } from "../../context/auth/AuthContext";

const MisPropiedades    = () => {
  const { asPath }      = useRouter();
  const { validRole }   = useContext(AuthContext);


  return (
    <>
      <SEO titulo="Mis Propiedades" url={asPath} />
      <Titulo titulo="Mis propiedades" />
      <FiltroPropiedades />
      <MiListaPropiedades />
    </>
  );
};

export default PrivateRoute(MisPropiedades);
