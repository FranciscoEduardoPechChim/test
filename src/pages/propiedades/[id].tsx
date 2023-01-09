import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Detalles from "../../components/paginas/propiedades/detalles/Detalles";
import Slider from "../../components/paginas/propiedades/detalles/Slider";
import Contact from "../../components/paginas/propiedades/detalles/Contact";
import SEO from "../../components/seo/SEO";
import { AuthContext } from "../../context/auth/AuthContext";
import { production } from "../../credentials/credentials";
import { InmueblesUsuario } from "../../interfaces/CrearInmuebleInterface";
import NotFound from "../404";

//Services
import { getPropertyByURL } from '../../services/propertyService';
import { getRequestSlugAndAuth } from '../../services/requestService';

const Ubicacion: any = dynamic(
  () => import("../../components/paginas/propiedades/detalles/Ubicación"),
  { ssr: false }
);

const Propiedad                                     = () => {
  const access_token                                = (typeof window !== "undefined") ? localStorage.getItem("token"):""; 
  const router                                      = useRouter();
  const { asPath, query }                           = router;
  const { id }                                      = query;
  const { auth }                                    = useContext(AuthContext);
  const [ property, setProperty ]                   = useState<any>({});
  const [ isValid, setIsValid ]                     = useState(false);

  const init                                        = async () => {
    if(id && (typeof id == 'string')) {
      setIsValid(false);

      const propertyResponse                        = await getPropertyByURL(id);
      
      if(propertyResponse && propertyResponse.data) {

        if(auth && auth.uid && access_token) {
          const requestResponse                     = await getRequestSlugAndAuth(auth.uid, id, access_token);

          if(requestResponse && requestResponse.data) {
            setIsValid((requestResponse.data.isValid) ? requestResponse.data.isValid:false);
          }
        }
        setProperty(propertyResponse.data.properties);
      }
    } 
  }

  useEffect(() => {
    init();
  }, [id]);


  if (!property.publicado) {
    return <NotFound />;
  }

  return (
    <>
      <SEO
        titulo      = {property.titulo}
        url         = {`/${property.slug}`}
        descripcion = {property.descripcion}
        img         = {property.imgs[0] ? property.imgs[0] : ""}
      />
      <Slider inmuebles = {property} />
      <Detalles inmuebles = {property} />
      <Ubicacion inmuebles = {property} isRequest = {isValid}/>
      {auth.uid && (auth.role != 'Usuario' || ((auth.correo == 'Eduardoest@internet360.com.mx') || (auth.correo == 'Eduardoest@i360.com.mx') || (auth.correo == 'francisco@i360.com.mx') || (auth.correo == 'jorge.katz1619@gmail.com'))) && <Contact inmuebles = {property} />}
    </>
  );
};

export default Propiedad;
