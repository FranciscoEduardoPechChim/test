import { useContext, useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Col, Overlay} from "react-bootstrap";
import { toast } from "react-toastify";
import { CopyToClipboard } from "react-copy-to-clipboard";
import styles from "./PropertiesCard.module.css";
import { InmuebleContext } from "context/inmuebles/InmuebleContext";
import { AuthContext } from "context/auth/AuthContext";

//Material UI
import { Tooltip } from "@material-ui/core";

interface Props {
  id: string;
  titulo: string;
  slug: string;
  imgs: string[];
  isActive: boolean;
  handleDelete: (pid: string) => Promise<void>;
  handleActivar: (pid: string) => Promise<void>;
  handleDesactivar: (pid: string) => Promise<void>;
}

const PropertiesCard                                                                        = (props: Props) => {
  const { titulo, id, slug, imgs, isActive, handleDelete, handleActivar, handleDesactivar } = props;

  const { setEditar, setIdInmueble }                                                        = useContext(InmuebleContext);
  const { validRole }                                                                       = useContext(AuthContext);
  const router                                                                              = useRouter();
  const target                                                                              = useRef(null);
  const [mostrarMenu, setMostrarMenu]                                                       = useState(false);
  const [isRole, setIsRole]                                                                 = useState(false);

  const goToProperty                                                                        = () => router.push("/propiedades/" + slug);

  const editarInmuebleInfo                                                                  = (id: string) => {
    setIdInmueble(id);
    setEditar("Información");
    router.push("/perfil/editar-info");
  };

  const editarInmuebleImg                                                                   = (id: string) => {
    setIdInmueble(id);
    setEditar("Imágenes");
    router.push("/perfil/editar-fotos");
  };

  const compartir                                                                           = () => toast.success(`Se ha copiado al portapapeles`);

  useEffect(() => {
    const initRole                                                                          = async () => {
      const role                                                                            = await validRole();
      setIsRole(role);
    }

    initRole();
  }, [validRole]);

  return (
    <Col xs={6} md={4} lg={4} xl={3} className="py-3 text-center ">
      <div className={`${styles.customCard} card pointer`}>
        <div onClick={goToProperty}>
          <div className={styles.imgContainer}>
            {imgs.length > 0 ? (
              <div
                className={styles.cardImg}
                style={{
                  backgroundImage: imgs.length > 0 ? `url(${imgs[0]})` : "",
                }}
              >
                {isActive ? null : (
                  <div className={styles.imgPausa}>
                    <div className={styles.imgTituloPausa}>
                      Inmueble en pausa
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.noImage}>
                <div className={styles.noImageText}>
                  Aún no hay imagenes para mostrar{" :("}
                </div>
              </div>
            )}
          </div>
          <div className={styles.tituloContainer}>
            <div
              className={`${
                isActive ? styles.proContent : styles.proContentFalse
              } my-2`}
            >
              {titulo}
            </div>
          </div>
        </div>
        {isRole &&
          <div
            className="btn-group"
            role="group"
            aria-label="Basic mixed styles example"
          >
            {isActive ? (
              <Tooltip
                title="Pausar"
                placement="top"
              >
                <button
                  onClick={() => handleDesactivar(id)}
                  className={`${styles.customBtn1} btn`}
                />
              </Tooltip>
            ) : (
              <Tooltip
                title="Desausar"
                placement="top"
              >
                <button
                  onClick={() => handleActivar(id)}
                  className={`${styles.customBtn1} btn`}
                />
              </Tooltip>
            )}

            {isActive ? (
              <CopyToClipboard
                onCopy={compartir}
                text={`https://red1a1.com/app/propiedades/${slug}`}
              >
                <Tooltip
                  title="Copiar"
                  placement="top"
                >
                  <button type="button" className={`${styles.customBtn2} btn`} />
                </Tooltip>
              </CopyToClipboard>
            ) : null}

            <Tooltip
              title="Editar"
              placement="top"
            >
              <button
                ref={target}
                onClick={() => setMostrarMenu(!mostrarMenu)}
                type="button"
                className={`${styles.customBtn3} btn`}
              >
                <Overlay
                      target={target.current}
                      show={mostrarMenu}
                      placement="right"
                    >
                      {({ placement, arrowProps, show: _show, popper, ...props }) => (
                        <div
                          className={styles.menu}
                          {...props}
                          style={{
                            ...props.style,
                          }}
                        >
                          <div
                            className={`${styles.menuItem} pointer mx-3 my-2`}
                            onClick={() => editarInmuebleInfo(id)}
                          >
                            Editar información
                          </div>

                          <div
                            className={`${styles.menuItem} pointer mx-3 my-2`}
                            onClick={() => editarInmuebleImg(id)}
                          >
                            Editar imágenes
                          </div>
                        </div>
                      )}
                  </Overlay>
              </button>
            </Tooltip>

            <Tooltip
              title="Eliminar"
              placement="top"
            >
              <button
                onClick={() => handleDelete(id)}
                type="button"
                className={`${styles.customBtn4} btn`}
              />
            </Tooltip>
          </div>
        }
      </div>
    </Col>
  );
};

export default PropertiesCard;
