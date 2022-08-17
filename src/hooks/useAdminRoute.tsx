import { FC, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/auth/AuthContext";
import Loading from "../components/ui/loading/Loading";

export const AdminRoute = (Component: any) => {
  return function RutaPrivada(props: FC) {
    const { auth } = useContext(AuthContext);
    const router = useRouter();

    // @ts-ignore
    useEffect(() => {
      if (auth.role !== "Administrador") {
        router.replace("/");
        return <Loading />;
      }
    }, []);

    return <Component auth={auth} {...props} />;
  };
};
