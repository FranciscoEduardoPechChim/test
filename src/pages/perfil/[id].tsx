//React
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
//Components
import Perfil from "../../components/paginas/perfil/perfil/Perfil";
import Loading from "components/ui/loading/Loading";
import SEO from "../../components/seo/SEO";
import NotFound from "../404";
//Middlewares
import { hasPermission } from '../../middlewares/roles';
//Context
import { AuthContext } from '../../context/auth/AuthContext';
import { InmuebleContext } from "context/inmuebles/InmuebleContext";
//Hooks
import { useUserProperties } from '../../hooks/useUserInfo';
//Extras

const EditProfile                 = () => {
    const access_token            = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
    const router                  = useRouter();
    const [user, setUsers]        = useState<any>({});
    const { getUser }      = useContext(AuthContext);
    const { id }                  = router.query;
    const { loading }             = useUserProperties((id && (typeof id == 'string')) ? id:'', 0, 12, (access_token) ? access_token:'');

    const initialization         = async () => {
      if(id && (typeof id == 'string') && access_token) {
        const userResponse        = await getUser(id, access_token);
  
        if(userResponse) {
          setUsers(userResponse);
        }
      }
    }

    useEffect(() => {
      initialization();
    }, [id]);

    if (!user.uid || (!hasPermission('admin.profile.property') )) {
      return <NotFound />;
    }

    return (
      <>
        {(loading) ? <Loading />:
          <>
             <SEO titulo="Editar perfil" url={router.asPath} />
              {hasPermission('admin.profile.property') &&
                <Perfil data={user} />
              }
          </>
        }
      </>
    );
}

export default EditProfile;