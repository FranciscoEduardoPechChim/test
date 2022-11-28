import { useContext } from "react";
import { useRouter } from "next/router";
import MyRoleByPermissions from '../../components/paginas/dashboard/rolebypermissions/MyRoleByPermissions';
import DashboardLayout from "../../components/layout/Dashboard";
import SEO from "../../components/seo/SEO";
import { AuthContext } from "../../context/auth/AuthContext";
import { PrivateRoute } from "../../hooks/usePrivateRoute";
import NotFound from "../404";


const MyRoleByPermissionsPage = () => {
  const router = useRouter();
  const { auth } = useContext(AuthContext);

  if (auth.role === "Individual") {
    return <NotFound />;
  }

  return (
    <>
      <SEO titulo="Administrar roles por permisos" url={router.asPath} />
      <DashboardLayout titulo="ROLES POR PERMISOS">
        <MyRoleByPermissions />
      </DashboardLayout>
    </>
  );
};

export default PrivateRoute(MyRoleByPermissionsPage);