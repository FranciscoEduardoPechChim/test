//React
import { useRouter } from "next/router";
//Component
import SelectComponent from "components/ui/filters/SelectComponent";
import MyProperties from "components/paginas/perfil/followers/MyProperties";
import Titulo from "components/ui/titulo/Titulo";
import SEO from "components/seo/SEO";
//Hooks
import { PrivateRoute } from "hooks/usePrivateRoute";

const MyPropertiesFollowers = () => {
  const router              = useRouter();

  return (
    <>
      <SEO titulo="Mis propiedades seguidas" url={router.asPath} />
      <Titulo titulo="Propiedades seguidas" />
      <SelectComponent type={'propertiesFollowers'} />
      <MyProperties />
    </>
  );
};

export default PrivateRoute(MyPropertiesFollowers);
