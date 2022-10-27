import { useContext } from "react";
import { useRouter } from "next/router";
import MyPromotions from '../../components/paginas/perfil/promotions/MyPromotions';
import SEO from "../../components/seo/SEO";
import Titulo from "../../components/ui/titulo/Titulo";
import { AuthContext } from "../../context/auth/AuthContext";
import { PrivateRoute } from "../../hooks/usePrivateRoute";
import NotFound from "../404";

const MisUsuariosPage = () => {
  const router = useRouter();
  const { auth } = useContext(AuthContext);

  if (auth.role === "Individual") {
    return <NotFound />;
  }

  return (
    <>
      <SEO titulo="Administrar promociones" url={router.asPath} />
      <Titulo titulo="Mis promociones" />
      <MyPromotions />
    </>
  );
};

export default PrivateRoute(MisUsuariosPage);