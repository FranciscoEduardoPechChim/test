import { FC, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/auth/AuthContext";
import Loading from "../components/ui/loading/Loading";

//Middlewares
import { isAdmin, isSuperAdmin } from "middlewares/roles";

export const AdminRoute = (Component: any) => {
  return function RutaPrivada(props: FC) {
    const { auth } = useContext(AuthContext);
    const router = useRouter();

    if (!(isAdmin() || isSuperAdmin())) {
      useEffect(() => {
        router.replace("/");
      }, []);
      return <Loading />;
    }

    return <Component auth={auth} {...props} />;
  };
};
