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
  slug: string;
  imgs: any;
  isActive: boolean;
  title: string;
  handleDelete: (pid: string) => Promise<void>;
  handleStatus: (pid: string, status: boolean) => Promise<void>;
  handleEdit:   (pid: string) => Promise<void>;
}

const PropertiesCard                                                                        = (props: Props) => {
  const { id, slug, imgs, isActive, title, handleDelete, handleStatus, handleEdit }         = props;
  const { validRole }                                                                       = useContext(AuthContext);
  const router                                                                              = useRouter();
  const [isRole, setIsRole]                                                                 = useState(false);

  const goToProperty                                                                        = () => router.push("/propiedades/" + slug);

  const compartir                                                                           = () => toast.success(`Se ha copiado al portapapeles`);

  useEffect(() => {
    const initRole                                                                          = async () => {
      const role                                                                            = await validRole();
      setIsRole((role) ? role:false);
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
              {title}
            </div>
          </div>
        </div>
        {isRole &&
          <div
            className="btn-group"
            role="group"
            aria-label="Basic mixed styles example"
          >
           
            <Tooltip
              title     = {(isActive) ? "Pausar":"Despausar"}
              placement = "top"
            >
              <button
                onClick={() => handleStatus(id, (isActive) ? false:true)}
                className={`${styles.customBtn1} btn`}
              />
            </Tooltip>
            
            {isActive &&
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
            }

            <Tooltip
              title="Editar"
              placement="top"
            >
              <button
                onClick   = {() => handleEdit(id)}
                type      = "button"
                className = {`${styles.customBtn3} btn`}
              >
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
