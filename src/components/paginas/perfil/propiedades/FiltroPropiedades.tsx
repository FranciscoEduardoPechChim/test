import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Form } from "react-bootstrap";
import { InmuebleContext } from "context/inmuebles/InmuebleContext";
import { AuthContext } from "context/auth/AuthContext";
import Button from "../../../ui/button/Button";
import styles from "./filtros.module.css";

//Services
import { showUsersByOwner } from '../../../../services/userService';

const FiltroPropiedades         = () => {
  const access_token            = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
  const { orden, setOrden,
    user, setUser }             = useContext(InmuebleContext);
  const { auth, validRole }     = useContext(AuthContext);
  const router                  = useRouter();
  const [isRole, setIsRole]     = useState(false);
  const [users, setUsers]       = useState<any>([]);

  const agregarPropiedad        = () => router.push("/perfil/agregar-inmueble");

  useEffect(() => {
    const initRole              = async () => {
      if(auth && auth.uid && access_token) {
        const role              = await validRole();
        const response          = await showUsersByOwner(auth.uid, access_token);
        
        if(response && response.data && role) {
          setUsers(response.data.users);
          setIsRole(role);
        }
      }
    }

    initRole();
  }, [validRole]);


  return ( 
    <section>
      <div className="container my-4">
        <div className="row d-flex justify-content-between">
          {(isRole) ?
            <div className="col-6">
              <Button
                titulo="Añadir propiedad"
                btn="Green"
                onClick={agregarPropiedad}
              />
            </div>
            :
            <div className="col-6"></div>
          }
          <div className="col-3" >
              <Form.Select
                aria-label  = "Default user"
                className   = {styles.customSelect}
                value       = {user}
                onChange    = {(e) => {
                  setUser(e.target.value);
                }}
              >
                <option value={'all'} >Todos</option>
                {users && (users.length != 0) && users.map((value:any, key: any) => {
                  return (<option key={key} value={value.uid}>{value.nombre} {value.apellido}</option>);
                })}
              </Form.Select>
          </div>
          <div className="col-3" >
              <Form.Select
                aria-label="Default select example"
                className={styles.customSelect}
                value={orden}
                onChange={(e) => {
                  setOrden(e.target.value);
                }}
              >
                <option value="createdAt">Recientes</option>
                <option value="titulo">A-Z</option>
                <option value="location">Ubicación (Zonas)</option>
              </Form.Select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiltroPropiedades;
