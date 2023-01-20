import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Col } from "react-bootstrap";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/auth/AuthContext";
import { ChatContext, CrearChat } from "../../../context/chat/ChatContext";
import { eliminarFavorito } from "../../../helpers/fetch";
import styles from "./FavsCard.module.css";

//Material UI
import { Tooltip } from "@material-ui/core";

type Solicitud = "Pendiente" | "Aprobado" | "Rechazado";

interface Props {
  id: string;
  slug: string;
  img: string[] | string;
  titulo: string;
  solicitud: Solicitud;
  propietario: string;
  handleDelete: (id: string) => Promise<void>;
}
  
const FavPropertiesCard                                                 = (props: Props) => {
  const { titulo, id, img, slug, solicitud, propietario, handleDelete } = props;

  const router                                                          = useRouter();
  const { auth, validRole }                                             = useContext(AuthContext);
  const { iniciarChat }                                                 = useContext(ChatContext);
  const [isRole, setIsRole]                                             = useState(false);
  const goToProperty                                                    = () => router.push(`/propiedades/${slug}`);
  const compartir                                                       = () => toast.success(`Se ha copiado al portapapeles`);

  const data: CrearChat = {
    remitente: auth.uid,
    destinatario: propietario,
  };

  
  useEffect(() => {
    const initRole                                                      = async () => {
      const role                                                        = await validRole();
      setIsRole((role) ? role:false); 
    }

    initRole();
  }, [validRole]);

  return (
    <Col xs={6} md={4} lg={4} xl={3} className="py-3 text-center">
      <div className={`${styles.customCard} card pointer`}>
        {/* {solicitud === "Pendiente" ? (
          <img
            className={styles.iconoF}
            src="/images/icons/properties-icons/pendiente.png"
            alt=""
          />
        ) : null}
        {solicitud === "Aprobado" ? (
          <img
            className={styles.iconoF}
            src="/images/icons/properties-icons/aprobado.png"
            alt=""
          />
        ) : null}
        {solicitud === "Rechazado" ? (
          <img
            className={styles.iconoF}
            src="/images/icons/properties-icons/rechazado.png"
            alt=""
          />
        ) : null} */}

        <div onClick={goToProperty}>
          <div className={styles.imgContainer}>
            <div
              className={styles.cardImg}
              style={{
                backgroundImage: img.length > 0 ? `url(${img[0]})` : "",
              }}
            />
          </div>
          <div className={styles.tituloContainer}>
            <div className={`${styles.proContent} my-2`}>{titulo}</div>
          </div>
        </div>

        {isRole &&
          <div
            className="btn-group"
            role="group"
            aria-label="Basic mixed styles example"
          >
            <Tooltip
              title     = "Chat"
              placement = "top"
              >
                <button
                  onClick={async () => await iniciarChat(data)}
                  type="button"
                  className={`${styles.customBtn2} btn`}
                />
            </Tooltip>
      
            <CopyToClipboard
              onCopy={compartir}
              text={`https://red1a1.com/app/propiedades/${slug}`}
              >
                <Tooltip
                  title     = "Compartir"
                  placement = "top"
                  >  
                  <button type="button" className={`${styles.customBtn3} btn`} />
                </Tooltip>
            </CopyToClipboard>
          
            <Tooltip
              title     = "Eliminar"
              placement = "top"
              >           
              <button
                type="button"
                className={`${styles.customBtn4} btn`}
                onClick={() => handleDelete(id)}
              />
            </Tooltip>
          
          </div>
        }
      </div>
    </Col>
  );
};

export default FavPropertiesCard;
