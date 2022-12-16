import { useContext } from "react";
import { AuthContext } from "../../../../context/auth/AuthContext";
import { ChatContext, CrearChat } from "../../../../context/chat/ChatContext";
import { InmueblesUsuario } from "../../../../interfaces/CrearInmuebleInterface";
import Button from "../../../ui/button/Button";
import styles from "./Inmueble.module.css";

interface Props {
  inmuebles: InmueblesUsuario;
    
}

const Contact               = ({ inmuebles }: Props) => {
  const access_token        = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
  const { auth }            = useContext(AuthContext);
  const { chat }            = useContext(ChatContext);

  const data: CrearChat     = {
    remitente: auth.uid,
    destinatario: inmuebles.usuario._id,
  };
 
  const startChat           = async () => {
    if(auth && auth.uid && inmuebles && inmuebles.usuario.uid && access_token) {
      if(auth.uid != inmuebles.usuario.uid) { 
        await chat(auth.uid, inmuebles.usuario.uid, access_token);
      }
    }
  }

  return (
    <section>
      <div className="row w-100 gx-0">
        <div className="col-sm-12 col-md-12 col-lg-5">
          <div className={styles.contenidoContactoDerecha}>
            <div className={styles.miniTutuloC}>Datos del contacto</div>
            <div className={`${styles.nombreC} mb-2`}>
              <img
                className="me-2"
                src="/images/icons/deatails-icons/propietario.png"
                alt=""
              />
              {inmuebles.usuario.nombre}{" "}
              {inmuebles.usuario.apellido} {/*Ajustar esta mierda*/}
            </div>
            <div className={styles.telefonoC}>
              <img
                className="me-2"
                src="/images/icons/deatails-icons/telefono.png"
                alt=""
              />
              {inmuebles.usuario.telefonoPersonal
                ? inmuebles.usuario.telefonoPersonal
                : inmuebles.usuario.telefonoOficina
                ? inmuebles.usuario.telefonoOficina
                : "Número oculto"}
            </div>
            {inmuebles.comisiones ? (
              <div>
                <i
                  style={{ color: "#7149BC", fontSize: 25, marginRight:'12px', marginLeft: '6px' }}
                  className="bi bi-currency-dollar"
                />
                <span className={styles.telefonoC} style={{fontSize: '22px'}}>
                  Comisión {inmuebles.comisiones}%
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="col-sm-12 col-md-12 col-lg-7">
          <div className={styles.contenidoContactoIzquierda}>
            <div className={`${styles.LeftTitulo} text-center mb-4`}>
              Inicia una conversación con el asesor <br /> de este inmueble
            </div>
            <div className="text-center">
              <Button
                titulo="iniciar Chat"
                onClick={startChat}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
