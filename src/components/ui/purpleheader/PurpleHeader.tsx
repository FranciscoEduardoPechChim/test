import { useContext } from "react";
import Link from "next/link";
import { MapContext } from "context/map/MapContext";
import { AuthContext } from "../../../context/auth/AuthContext";
import Buscador from "../buscador/Buscador";
import styles from "./PurpleHeader.module.css";

//Middlewares
import { hasPermission } from '../../../middlewares/roles';

const PurpleHeader              = () => {
  const { auth }                = useContext(AuthContext);
  const { setFiltros, filtros } = useContext(MapContext);

  const mostrarFiltros          = () => setFiltros(!filtros);

  return (
    <div className={styles.purpleNav2}>
      <ul className="nav d-flex justify-content-center">
        {auth.uid ? (
          <>
            {hasPermission('properties') &&
              <li className="nav-item mt-2">
                <Link href="/perfil/mis-propiedades">
                  <div className={`${styles.purpleLinks} pointer`}>
                    Mis Propiedades  
                  </div>
                </Link>
              </li>
            }
            {hasPermission('admin.favorites') &&
              <li className="nav-item mt-2">
                <Link href="/perfil/mis-favoritos">
                  <div className={`${styles.purpleLinks} pointer`}>
                    Mis Favoritos
                  </div>
                </Link>
              </li>
            }
            {/* {hasPermission('profile') &&
              <li className="nav-item mt-2">
                <Link href="/perfil">
                  <div className={`${styles.purpleLinks} pointer`}>
                    Mi Perfil
                  </div>
                </Link>
              </li>
            } */}
            {hasPermission('shareproperties') &&
              <li className="nav-item mt-2">
                <Link href="/perfil/propiedades-compartidas">
                  <div className={`${styles.purpleLinks} pointer`}>
                    Propiedades compartidas
                  </div>
                </Link>
              </li>
            } 
            {hasPermission('estates') &&
              <li className="nav-item mt-2">
                <Link href="/perfil/historial-de-inmueble">
                  <div className={`${styles.purpleLinks}  pointer`}>
                    Historial de Inmuebles 
                  </div>
                </Link>
              </li>
            }
          </>
        ) : null}
     
        <li className="nav-item">
          <div className={styles.filterIconContainer}>
            <Buscador  />
            <i
              onClick={mostrarFiltros}
              className={`${
                filtros ? styles.filterIconActive : styles.filterIcon
              } bi bi-sliders pointer`}
            />
          </div>
        </li>
        
        <li>
          <button className={styles.searchBtn}>
            <i className="bi bi-search" />
          </button>
        </li>
        
      </ul>
    </div>
  );
};

export default PurpleHeader;
