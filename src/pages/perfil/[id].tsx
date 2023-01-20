//React
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
//Components
import Perfil from "../../components/paginas/perfil/perfil/Perfil";
import SEO from "../../components/seo/SEO";
import NotFound from "../404";
//Context
import { AuthContext } from '../../context/auth/AuthContext';



const EditProfile                 = () => {
    const router                  = useRouter();
    const [user, setUsers]        = useState<any>({});
    const { userWithoutToken }    = useContext(AuthContext);
    const { id }                  = router.query;

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
        <SEO titulo="Editar perfil" url={router.asPath} />
        <Perfil data={user} />      
      </>
    );
}

export default EditProfile;