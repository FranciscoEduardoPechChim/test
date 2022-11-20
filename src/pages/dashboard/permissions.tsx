import { useContext } from "react";
import { useRouter } from "next/router";
import MyPermissions from '../../components/paginas/dashboard/permissions/MyPermissions';
import DashboardLayout from "../../components/layout/Dashboard";
import SEO from "../../components/seo/SEO";
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
      <SEO titulo="Administrar permisos" url={router.asPath} />
      <DashboardLayout titulo="PERMISOS">
        <MyPermissions />
      </DashboardLayout>
    </>
  );
};

export default PrivateRoute(MisUsuariosPage);