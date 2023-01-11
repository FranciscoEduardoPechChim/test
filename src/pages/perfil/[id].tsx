//React
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
//Components
import Perfil from "../../components/paginas/perfil/perfil/Perfil";
import Loading from "components/ui/loading/Loading";
import SEO from "../../components/seo/SEO";
import NotFound from "../404";
//Context
import { AuthContext } from '../../context/auth/AuthContext';
import { InmuebleContext } from "context/inmuebles/InmuebleContext";
//Hooks
import { useUserWithoutTokenProperties } from '../../hooks/useUserInfo';
//Extras

const EditProfile                 = () => {
    const router                  = useRouter();
    const [user, setUsers]        = useState<any>({});
    const { userWithoutToken }    = useContext(AuthContext);
    const { id }                  = router.query;
    const { loading }             = useUserWithoutTokenProperties((id && (typeof id == 'string')) ? id:'', 0, 12);

    const initialization          = async () => {
      if(id && (typeof id == 'string')) {
        const userResponse        = await userWithoutToken(id);

        if(userResponse) {
          setUsers(userResponse);
        }
      }
    }

    useEffect(() => {
      initialization();
    }, [id]);

    if (!user.uid) {
      return <NotFound />;
    }

    return (
      <>
        {(loading) ? <Loading />:
          <>
            <SEO titulo="Editar perfil" url={router.asPath} />
            <Perfil data={user} />
          </>
        }
      </>
    );
}

export default EditProfile;