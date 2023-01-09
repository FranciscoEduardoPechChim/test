import { Dispatch, MutableRefObject, SetStateAction, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Overlay } from "react-bootstrap";
import { AuthContext } from "context/auth/AuthContext";
import styles from "./Header.module.css";
import { ChatContext } from "context/chat/ChatContext";

//Middleware
import { hasPermission } from '../../../middlewares/roles';

interface Props {
  setMostrarMenu: Dispatch<SetStateAction<boolean>>;
  target: MutableRefObject<null>;
  setNotificaciones: Dispatch<SetStateAction<boolean>>;
  mostrarMenu: boolean;
}
 
const MenuUsuario                                                   = (props: Props) => {
  const { setMostrarMenu, target, setNotificaciones, mostrarMenu }  = props;
  const { auth, logOut }                                            = useContext(AuthContext);
  const { chatState }                                               = useContext(ChatContext);
  const router                                                      = useRouter();

  const cerrarSesion = () => {
    logOut();
    setMostrarMenu(false);
    setNotificaciones(false);
    chatState.chatActivo = null;
    router.push('/');
  };

  return (
    <>
      <div
        className={`${styles.navPerfil} pointer ms-3`}
        ref={target}
        onClick={() => setMostrarMenu(!mostrarMenu)}
      >
        <img
          src={auth.img}
          alt="Mi perfil"
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
          }}
        />
      </div>
      <Overlay target={target.current} show={mostrarMenu} placement="right">
        {({ placement, arrowProps, show: _show, popper, ...props }) => (
          <div
            className={styles.menu}
            {...props}
            style={{
              ...props.style,
            }}
          >
            {hasPermission('profile') &&
              <Link href="/perfil">
                <div
                  className={`${styles.menuItem} pointer mx-3 my-2`}
                  onClick={() => {
                    setMostrarMenu(false);
                  }}
                >
                  Mi Perfil
                </div>
              </Link>
            }
            {hasPermission('users') &&
              <Link href="/perfil/mis-usuarios">
                <div
                  className={`${styles.menuItem} pointer mx-3 my-2`}
                  onClick={() => {
                    setMostrarMenu(false);
                  }}
                >
                  Mis Usuarios
                </div>
              </Link>
            }
            {hasPermission('packages') &&
              <Link href="/perfil/mis-paquetes">
                <div
                  className={`${styles.menuItem} pointer mx-3 my-2`}
                  onClick={() => {
                    setMostrarMenu(false);
                  }}
                >
                  Mis Paquetes 
                </div>
              </Link>
            }
            {hasPermission('payments') &&
              <Link href="/perfil/historial-de-pagos">
                <div
                  className={`${styles.menuItem} pointer mx-3 my-2`}
                  onClick={() => {
                    setMostrarMenu(false);
                  }}
                >
                  Mis Pagos 
                </div>
              </Link>
            }
            {hasPermission('followers') &&
              <Link href="/perfil/my-followers">
                <div
                  className={`${styles.menuItem} pointer mx-3 my-2`}
                  onClick={() => {
                    setMostrarMenu(false);
                  }}
                >
                  Agentes seguidos
                </div>
              </Link>
            }
            {hasPermission('properties.followers') &&
              <Link href="/perfil/my-properties-followers">
                <div
                  className={`${styles.menuItem} pointer mx-3 my-2`}
                  onClick={() => {
                    setMostrarMenu(false);
                  }}
                >
                  Propiedades seguidas
                </div>
              </Link>
            }
            {hasPermission('references') && 
              <Link href="/perfil/referencias-de-pago">
                <div
                  className={`${styles.menuItem} pointer mx-3 my-2`}
                  onClick={() => {
                    setMostrarMenu(false);
                  }}
                >
                  Referencias
                </div>
              </Link>
            }
            {hasPermission('admin.dasboard') &&
              <Link href="/dashboard">
                <div
                  className={`${styles.menuItem} pointer mx-3 my-2`}
                  onClick={() => {
                    setMostrarMenu(false);
                  }}
                >
                  Dashboard
                </div>
              </Link>
            }

            <hr />
            <div
              className={`${styles.menuCerrar} pointer mx-3 my-2`}
              onClick={cerrarSesion}
            > 
              <i className="bi bi-box-arrow-right"></i> Cerrar sesión 
            </div>
          </div>
        )}
      </Overlay>
    </>
  );
};

export default MenuUsuario;
