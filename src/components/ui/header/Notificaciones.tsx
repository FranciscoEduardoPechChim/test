import {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useContext,
} from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Solicitud } from "interfaces/SolicitudInteface";
import { IsProperties } from "interfaces/SolicitudInteface";
import { fetchAceptarRechazarSolicitud } from "helpers/fetch";
import { Overlay, Popover, OverlayTrigger } from "react-bootstrap";
import { AuthContext } from "context/auth/AuthContext";
import NotificacionItem from "./NotificacionItem";
import { production } from "credentials/credentials";

//Services
import { requestStatusProperty, updateIsProperties } from '../../../services/requestService';
//Helpers
import { validate } from '../../../helpers/response';

interface Props {
  target: any;
  cargando: boolean;
  solicitudes: Solicitud[];
  contador: number;
  setContador: Dispatch<SetStateAction<number>>;
  notificacionRef: any;
  setSolicitudes: Dispatch<SetStateAction<Solicitud[]>>;
  isProperties: IsProperties[];
  setMostrarMenu: Dispatch<SetStateAction<boolean>>;
}

const Notificaciones                                  = (props: Props) => {
  const { target, cargando, solicitudes, contador, 
    setContador, notificacionRef, setSolicitudes, 
    isProperties, setMostrarMenu }                    = props;

  const access_token                                  = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
  const { auth }                                      = useContext(AuthContext);
  const router                                        = useRouter();

  const goToProperty                                  = (slug: string) => router.push(`propiedades/${slug}`);

  const goToSolicitudes                               = () => {
    router.push("/perfil/propiedades-compartidas");
  }

  const statusRequest                                 = async (id: string, status: string) => {
    if(status && access_token) {
      const response                                  = await requestStatusProperty(id, status, access_token);
   
      if(response && response.ok) {
        toast.error(response.msg);
        return false;
      }

      if(response && response.data && solicitudes) {
        const solicituds: Solicitud[]                 = solicitudes.map((solicitud:any) => {
          if (solicitud._id === id) {
            return { ...solicitud, estado: status };
          }
          return solicitud;
        });

        setSolicitudes(solicituds);
        setContador((prev) => prev - 1);
        toast.success(response.msg);
      }
    }
  }

  const handleProperties                              = async (id: string, slug: string) => {
    if(id && slug && access_token) {
      const response                                  = await updateIsProperties(id, false, access_token);

      if(response && response.errors) {
        validate(response.errors);
        return false;
      }

      if(response && response.ok) {
        toast.error(response.msg);
        return false;
      }

      if(response && response.data) {
        goToProperty(slug);
      }
    }
  }
  
  // const popover                                       = (
  //   <Popover id="popover-basic">
  //     <Popover.Body>
         
  //     </Popover.Body>
  //   </Popover>
  // );

  return (
    <>
     <NotificacionItem
        target              = {target}
        targetNotification  = {notificacionRef}
        contador            = {contador}
        cargando            = {cargando}
        solicitudes         = {solicitudes}
        goToProperty        = {goToProperty}
        statusRequest       = {statusRequest}
        goToSolicitudes     = {goToSolicitudes}
        isProperties        = {isProperties}
        handleProperties    = {handleProperties}
      />
    
      {/* <div className="text-center" ref={notificacionRef}>
        <div
          className = "ms-3"
          onClick   = {() => console.log('13')}
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
      </div> */}
      {/* <NotificacionItem
        target            = {target}
        cargando          = {cargando}
        solicitudes       = {solicitudes}
        notificaciones    = {true}
        goToProperty      = {goToProperty}
        // aprobarSolicitud  = {aprobarSolicitud}
        // rechazarSolicitud = {rechazarSolicitud}
        statusRequest     = {statusRequest}
        goToSolicitudes   = {goToSolicitudes}
        isProperties      = {isProperties}
        handleProperties  = {handleProperties}
      /> */}
    </>
  );
};

export default Notificaciones;
