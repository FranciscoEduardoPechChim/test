import { FC, MutableRefObject } from "react";
import { Overlay, OverlayTrigger, Popover } from "react-bootstrap";
import { Solicitud } from "interfaces/SolicitudInteface";
import Loading from "../loading/Loading";
import styles from "./Header.module.css";
import Link from "next/link";

//Interfaces
import { IsProperties } from "interfaces/SolicitudInteface";

interface Props {
  target: MutableRefObject<null>;
  contador: number;
  targetNotification: any;
  cargando: boolean;
  solicitudes: Solicitud[];
  isProperties: IsProperties[];
  goToProperty: (slug: string) => Promise<boolean>;
  handleProperties: (id: string, slug: string) => void;
  statusRequest: (id: string, status: string) => void;
  // aprobarSolicitud: (
  //   id: string,
  //   titulo: string,
  //   img: string,
  //   correo: string
  // ) => Promise<void>;
  // rechazarSolicitud: (
  //   id: string,
  //   titulo: string,
  //   img: string,
  //   correo: string
  // ) => Promise<void>;
  goToSolicitudes: () => void;

}

const NotificacionItem: FC<Props> = (props) => {
  const {
    target,
    contador,
    targetNotification,
    cargando,
    solicitudes,
    goToProperty,
    statusRequest,
    goToSolicitudes,
    isProperties,
    handleProperties
  } = props;


  const popover                                                     = (
    <Popover id="popover-basic" className={styles.notificaciones}>
      <Popover.Body>
        <div>
          {cargando ? (
            <Loading />
          ) : (
            <>
              {(solicitudes.length +  isProperties.length) === 0 ? (
                <div
                  className="text-center py-5"
                  style={{ color: "#7A7A7A", fontWeight: "500" }}
                >
                  Aún no tiene notificaciones
                </div>
              ) : (
                <>
                  <div className={styles.headerNotif}>Notificaciones</div>
                  <div className={styles.notContainer}>
                    {solicitudes && solicitudes.map((solicitud:any, key: number) => {
                      return (
                      <div
                        className={
                          solicitud.estado === "Pendiente"
                            ? styles.pendiente
                            : styles.noPendiente
                        }
                        key={key}
                      >
                        <div className={styles.notificacionContainer}>
                          <table>
                            <tr>
                              <td valign="middle">
                                <div className={`${styles.notifImg}`}>
                                  <img
                                    src={
                                      solicitud.usuario.img
                                        ? solicitud.usuario.img
                                        : ""
                                    }
                                    alt={solicitud.usuario.nombre}
                                    style={{
                                      borderRadius: "50%",
                                      width: "100%",
                                    }}
                                  />
                                </div>
                              </td>
                              <td>
                                {solicitud.estado === "Pendiente" ? (
                                  <>
                                    <b>
                                      {solicitud.nombre
                                        ? solicitud.nombre
                                        : solicitud.usuario.nombre}{" "}
                                      {solicitud.apellido
                                        ? solicitud.apellido
                                        : solicitud.usuario.apellido}{" "}
                                    </b>
                                    quiere que le compartas este inmueble:{" "}
                                  </>
                                ) : solicitud.estado === "Aprobado" ? (
                                  <span>
                                    Haz aceptado la solicitud de{" "}
                                    <b>
                                      {solicitud.nombre
                                        ? solicitud.nombre
                                        : solicitud.usuario.nombre}{" "}
                                      {solicitud.apellido
                                        ? solicitud.apellido
                                        : solicitud.usuario.apellido}
                                      {". "}
                                    </b>
                                    Ahora puedes compartir{" "}
                                  </span>
                                ) : solicitud.estado === "Rechazado" ? (
                                  <span>
                                    Haz rechazado la solicitud de{" "}
                                    <b>
                                      {solicitud.nombre
                                        ? solicitud.nombre
                                        : solicitud.usuario.nombre}{" "}
                                      {solicitud.apellido
                                        ? solicitud.apellido
                                        : solicitud.usuario.apellido}
                                      {". "}
                                    </b>
                                    Inmueble rechazado:{" "}
                                  </span>
                                ) : (
                                  "Error. Jamás debe de llegar a esta punto"
                                )}
                                <span className={`${styles.propNotifi} pointer`}>
                                  <Link
                                    href      = {`https://red1a1.com/app/propiedades/${solicitud.slug ? solicitud.slug : solicitud.inmueble.slug}`}
                                  >
                                    <div onClick = {() => { document.body.click(); }} >  
                                      {solicitud.titulo ? solicitud.titulo : solicitud.inmueble ? solicitud.inmueble.titulo : ''}
                                    </div>
                                  </Link>
                                </span>

                                {/* <span
                                  className={`${styles.propH} pointer`}
                                  onClick={() =>
                                    goToProperty(
                                      solicitud.slug
                                        ? solicitud.slug
                                        : solicitud.inmueble.slug
                                    )
                                  }
                                >
                                  {solicitud.titulo
                                    ? solicitud.titulo
                                    : solicitud.inmueble
                                      ? solicitud.inmueble.titulo
                                      : ''}
                                </span> */}
                              </td>
                            </tr>
                          </table>

                          {(solicitud.estado === "Pendiente") &&
                            <div className="d-flex justify-content-center mt-2">
                              <button
                                onClick={() => statusRequest(solicitud._id, 'Aprobado')}
                                className={`${styles.btnApprove} me-2`}
                              >
                                <i
                                  className={`${styles.iconNoti} bi bi-check-circle`}
                                ></i>
                              </button>
                              <button
                                onClick={() => statusRequest(solicitud._id, 'Rechazado')}
                                className={`${styles.btnReject} me-2`}
                              >
                                <i
                                  className={`${styles.iconNoti} bi bi-x-circle`}
                                ></i>
                              </button>
                            </div>
                          }
                        </div>
                      </div>);
                    })}
                    {isProperties && isProperties.map((item:any, key: number) => {
                      return (item.isValid) ? (
                        <div className = { styles.pendiente } key = {key} >
                          <div className={styles.notificacionContainer}>
                            <table>
                              <tr>
                                <td>
                                  <>
                                    <b>
                                      {(item && item.owner && item.owner.nombre && item.owner.apellido) ?
                                       item.owner.nombre + ' ' + item.owner.apellido + ' ':''
                                      }
                                    </b>
                                    ha creado un nuevo inmueble:{" "}
                                  </>
                                  <span
                                    className={`${styles.propH} pointer`}
                                    onClick={() =>
                                      handleProperties(item._id, item.property.slug)
                                    }
                                  >
                                    {(item && item.property) ? item.property.titulo:''}
                                  </span> 
                                </td>
                              </tr>
                            </table>
                          </div>
                        </div>
                      ):null;  
                    })
                    }
                  </div>
                </>
              )}
              {(solicitudes && solicitudes.length !== 0) &&
                <div className="d-flex justify-content-center py-2">
                  <div
                    className={`${styles.footVer} pointer`}
                    onClick={goToSolicitudes}
                  >
                    Ver todas las solicitudes
                  </div>
                </div>
              }
            </>
          )}
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
      <OverlayTrigger 
        target          = {targetNotification.current}
        trigger         = "click"
        placement       = "bottom" 
        overlay         = {popover}
        rootClose       
        >
          <div className="text-center">
            <div
              className = "ms-3"
              style     = {{
                border: "2.5px solid #7149bc",
                borderRadius: "50%",
                padding: "0px 6px",
                boxSizing: "border-box",
                marginTop: "12px",
                width: "38px",
              }}
            >
              <i
                style={{ fontSize: "20px", color: "#7149BC" }}
                className="bi bi-bell-fill pointer"
              />
            </div>
            {contador > 0 ? (
              <span
                style={{
                  position: "absolute",
                  top: 30,
                  marginLeft: 22,
                  color: "#fff",
                  fontSize: 8,
                }}
                className="px-2 py-1 translate-middle p-2 bg-danger border border-light rounded-circle"
              >
                {contador}
              </span>
            ) : null}
          </div>
      </OverlayTrigger> 
  );
};

export default NotificacionItem;
