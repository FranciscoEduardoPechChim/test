import { useContext, useEffect, useState } from "react";
import { DirectionsRenderer, GoogleMap, Marker } from "@react-google-maps/api";
import { Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { AuthContext } from "../../../../context/auth/AuthContext";
import { InmueblesUsuario } from "../../../../interfaces/CrearInmuebleInterface";
import Button from "../../../ui/button/Button";
import styles from "./Inmueble.module.css";
import { 
  agregarFav,
  fetchEnviarSolicitud,
  fetchSolicitud,
} from "../../../../helpers/fetch";
import { MapContext } from "context/map/MapContext";
import { SocketContext } from "context/socket/SocketContext";

//Services
import { requestProperty } from '../../../../services/requestService';
import { storeFavorite } from '../../../../services/favoriteService';
//Helpers
import { validate } from '../../../../helpers/response';

interface Props {
  inmuebles: InmueblesUsuario;
    
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

const options = {
  disableDefaultUI: true,
  streetViewControl: true,
  zoomControl: true,
  fullscreenControl: true,
};

const Ubicacion                                 = ({ inmuebles }: Props) => {
  const access_token                            = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
  const { auth, validRole }                     = useContext(AuthContext);
  const { ubicacionUsuario }                    = useContext(MapContext);
  const [comoLLegar, setComoLLegar]             = useState(false);
  const [direcciones, setDirecciones]           = useState<any>();
  const { socket }                              = useContext(SocketContext);
  const [isRole, setIsRole]                     = useState(false);

  const addFavorite                             = async (id: string) => {
    
    if(auth && auth.uid && inmuebles && inmuebles.usuario.uid && id && access_token) {
      const response                            = await storeFavorite(auth.uid, inmuebles.usuario.uid, id, access_token);
    
      if(response && response.errors) {
        validate(response.errors);
        return false;
      }

      if(response && response.ok) {
        toast.error(response.msg);
        return false;
      }

      if(response && response.data) {
        toast.success(response.msg);
      }
    }
  }

  const shareProperty                           = async () => {
    if(inmuebles && inmuebles.usuario.uid && auth && auth.uid && access_token && socket) {
      const response                            = await requestProperty(auth.uid, inmuebles.usuario.uid, inmuebles._id, 'Pendiente', access_token);
       
      if(response && response.errors) {
        validate(response.errors);
        return false;
      }

      if(response && response.ok) {
        toast.error(response.msg);
        return false;
      }

      if(response && response.data) {
        socket.emit("solicitud", response.data.requests);
        toast.success(response.msg);
      }    
    } 
  }

  const comoLlegar                              = () => setComoLLegar(!comoLLegar);

  const destination                             = {
    lat: inmuebles.lat,
    lng: inmuebles.lng,
  };

  const origin                                  = { lat: ubicacionUsuario.lat, lng: ubicacionUsuario.lng };

  useEffect(() => {
    const initRole                              = async () => {
      const role                                = await validRole();

      setIsRole((role) ? role:false);
    }

    const directionsService                     = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirecciones(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );

    initRole();
  }, [direcciones, validRole]);


  return (
    <section className="mt-5">
      <Container>
        <Row>
          <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{
                lat: inmuebles.lat,
                lng: inmuebles.lng,
              }}
              zoom={comoLLegar ? 10 : 16}
              options={options}
            >
              <Marker
                position={{
                  lat: inmuebles.lat,
                  lng: inmuebles.lng,
                }}
                icon={{
                  url: "/images/icons/marcador.svg",
                  scaledSize: new google.maps.Size(50, 50),
                }}
              />

              {comoLLegar ? (
                <Marker
                  position={{
                    lat: ubicacionUsuario.lat,
                    lng: ubicacionUsuario.lng,
                  }}
                  icon={{
                    url: "/images/icons/marcador.svg",
                    scaledSize: new google.maps.Size(50, 50),
                  }}
                />
              ) : null}
              {comoLLegar ? (
                <DirectionsRenderer directions={direcciones} />
              ) : null}
            </GoogleMap>

            <h3 className="text-center py-3">
              {ubicacionUsuario.lat === 0 ||
              ubicacionUsuario.lat === 0 ? null : (
                <Button
                  titulo={!comoLLegar ? "Mostrar ruta" : "Ocultar ruta"}
                  onClick={comoLlegar}
                />
              )}
            </h3>
          </div>
          <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div className={`${styles.inmuebleTitleUbicacion} mb-4`}>
              {inmuebles.titulo}
            </div>
            <div className="mb-4">
              <div className="row">
                <div className="col-12 mb-4">
                  <div className={`${styles.inmuebleTipo2} me-4`}>
                    <img
                      src="/images/icons/deatails-icons/ubicacion.png"
                      alt="..."
                      width={25}
                    />
                    {inmuebles.direccion}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.inmuebleContent}>
              {inmuebles.descripcion
                ? inmuebles.descripcion
                : "Aún no hay descripción para este inmueble"}
            </div>
          </div>

          {isRole &&
                <div className="d-flex justify-content-center col-12 text-center my-5">
                 {auth.uid ? (
                   <>
                     {auth.uid !== inmuebles.usuario._id ? (
                       <Button
                         titulo   = "Solicitar compartir"
                         onClick  = {shareProperty}
                       />
                     ) : null}
                   </>
                 ) : null}
     
                 <div className="px-2" />
                 {auth.uid ? (
                   <Button
                     titulo     = "Añadir a favoritos"
                     onClick    = {() => addFavorite(inmuebles._id)}
                   />
                 ) : null}
               </div>
          }
        </Row>
      </Container>
    </section>
  );
};

export default Ubicacion;
