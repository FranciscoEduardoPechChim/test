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

// export const getStaticPaths: GetStaticPaths = async () => {
//   const resp = await fetch(`${production}/inmuebles/`);
//   const data = await resp.json();

//   const paths = data.inmuebles.map((path: InmueblesUsuario) => {
//     return { params: { id: path.slug.toString() } };
//   });

//   return { paths, fallback: "blocking" };
// };

// export const getStaticProps: GetStaticProps = async (context) => {
//   const id = context.params!.id;
//   const resp = await fetch(`${production}/inmuebles/url/${id}`);
//   const data = await resp.json();

//   return { props: { inmuebles: data }, revalidate: 15, notFound: !data };
// };

// interface Props {
//   inmuebles: {
//     inmueble: InmueblesUsuario;
//     ok: boolean;
//   };
// }

const Ubicacion: any = dynamic(
  () => import("../../components/paginas/propiedades/detalles/Ubicación"),
  { ssr: false }
);

const Propiedad                                     = () => {
  const router                                      = useRouter();
  const { asPath, query }                           = router;
  const { id }                                      = query;
  const { auth }                                    = useContext(AuthContext);
  const [ property, setProperty ]                   = useState<any>({});

  const init                                        = async () => {
    if(id && (typeof id == 'string')) {
      const response                                = await getPropertyByURL(id);

      if(response && response.data) {
        setProperty(response.data.properties);
      }
    }
  }

  useEffect(() => {
    setProperty({});
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
      <Ubicacion inmuebles = {property} />
      {auth.uid && (auth.role != 'Usuario' || ((auth.correo == 'Eduardoest@internet360.com.mx') || (auth.correo == 'Eduardoest@i360.com.mx') || (auth.correo == 'francisco@i360.com.mx') || (auth.correo == 'jorge.katz1619@gmail.com'))) && <Contact inmuebles = {property} />}
    </>
  );
};

export default Propiedad;
