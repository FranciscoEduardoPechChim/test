import { Dispatch, MutableRefObject, SetStateAction, useContext, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Overlay, Popover, OverlayTrigger } from "react-bootstrap";
import { AuthContext } from "context/auth/AuthContext";
import styles from "./Header.module.css";
import { ChatContext } from "context/chat/ChatContext";

//Middleware
import { hasPermission } from '../../../middlewares/roles';

interface Props {
  target:             any;
}

 
const MenuUsuario                                                   = (props: Props) => {
  const { target }                                                  = props;
  const { auth, logOut }                                            = useContext(AuthContext);
  const { chatState }                                               = useContext(ChatContext);
  const router                                                      = useRouter();

  const cerrarSesion                                                = () => {
    logOut();
    chatState.chatActivo = null;   
    router.push('/');
  };

  const popover                                                     = (
    <Popover id="popover-basic" className={styles.menuContainer}>
      <Popover.Body>
        <div>
              {hasPermission('profile') &&
                <Link href="/perfil">
                  <div
                    className = {`${styles.menuItem} pointer mx-3 my-2`}
                    onClick   = {() => {
                      document.body.click();
                    }} 
                  >
                    Mi Perfil
                  </div>
                </Link>
              }
              {hasPermission('users') &&
                <Link href="/perfil/mis-usuarios">
                  <div
                    className = {`${styles.menuItem} pointer mx-3 my-2`}
                    onClick   = {() => {
                      document.body.click();
                    }} 
                  >
                    Mis Usuarios
                  </div>
                </Link>
              }
              {hasPermission('packages') &&
                <Link href="/perfil/mis-paquetes">
                  <div
                    className = {`${styles.menuItem} pointer mx-3 my-2`}
                    onClick   = {() => {
                      document.body.click();
                    }} 
                  >
                    Mis Paquetes 
                  </div>
                </Link>
              }
              {hasPermission('payments') &&
                <Link href="/perfil/historial-de-pagos">
                  <div
                    className = {`${styles.menuItem} pointer mx-3 my-2`}
                    onClick   = {() => {
                      document.body.click();
                    }} 
                  >
                    Mis Pagos 
                  </div>
                </Link>
              }
              {hasPermission('followers') &&
                <Link href="/perfil/my-followers">
                  <div
                    className = {`${styles.menuItem} pointer mx-3 my-2`}
                    onClick   = {() => {
                      document.body.click();
                    }} 
                  >
                    Agentes seguidos
                  </div>
                </Link>
              }

              {hasPermission('properties.followers') &&
                <Link href="/perfil/my-properties-followers">
                  <div
                    className = {`${styles.menuItem} pointer mx-3 my-2`}
                    onClick   = {() => {
                      document.body.click();
                    }} 
                  >
                    Propiedades seguidas
                  </div>
                </Link>
              }

              {hasPermission('references') && 
                <Link href="/perfil/referencias-de-pago">
                  <div
                    className = {`${styles.menuItem} pointer mx-3 my-2`}
                    onClick   = {() => {
                      document.body.click();
                    }} 
                  >
                    Referencias
                  </div>
                </Link>
              }

              {hasPermission('admin.dasboard') &&
                <Link href="/dashboard">
                  <div
                    className = {`${styles.menuItem} pointer mx-3 my-2`}
                    onClick   = {() => {
                      document.body.click();
                    }} 
                  >
                    Panel de control
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
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <OverlayTrigger
        target          = {target.current}
        trigger         = "click"
        placement       = "bottom" 
        overlay         = {popover}
        rootClose       
        >
          <div
              className = {`${styles.navPerfil} pointer ms-3`}
              ref       = {target}
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
      </OverlayTrigger>
    </>
  );
};

export default MenuUsuario;
