import { useRouter } from "next/router";
import MyFollowers from '../../components/paginas/perfil/followers/MyFollowers';
import SEO from "../../components/seo/SEO";
import { PrivateRoute } from "../../hooks/usePrivateRoute";

const MyFollowerPage            = () => {
  const router                  = useRouter();
 
  return (
    <>
      <SEO titulo="Mis seguimientos" url={router.asPath} />
      <MyFollowers />
    </>
  );
};

export default PrivateRoute(MyFollowerPage);