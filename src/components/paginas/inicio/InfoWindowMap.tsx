import { useContext } from "react";
import { useRouter } from "next/router";
import { InfoWindow } from "@react-google-maps/api";
import SwiperCore, { EffectCube, Pagination, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import { formatPrice } from "../../../helpers/formatPrice";
import styles from "./MapCards.module.css";
import { AuthContext } from "../../../context/auth/AuthContext";
import { agregarHist } from "../../../helpers/fetch";
import { InmueblesUsuario } from "interfaces/CrearInmuebleInterface";

//React
import { toast } from "react-toastify";
//Helpers
import { validate } from '../../../helpers/response';
// Services
import { storeHistory } from '../../../services/historyService';

SwiperCore.use([EffectCube, Pagination, Autoplay]);

interface Props {
  inmueble: InmueblesUsuario;
  handleClose: () => void;
}

const InfoWindowMap               = ({ inmueble, handleClose }: Props) => {
  const access_token              = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
  const router                    = useRouter();
  const { auth }                  = useContext(AuthContext);

  const handleProperty            = async (id: string, slug: string) => {
    if(id && slug) {
      if(auth.uid && id && access_token) {
        const response            = await storeHistory(auth.uid, id, access_token);

        if(response && response.errors) {
            validate(response.errors);
            return false;
        }

        if(response && response.ok) {
            toast.error(response.msg);
            return false;
        }
      }

      router.push(`/propiedades/${slug}`);
    }
  };

  return (
    <InfoWindow position={{ lat: inmueble.lat, lng: inmueble.lng }} onCloseClick={() => handleClose()}>
      <div className={styles.contenedorCard}>
        <div className={`${styles.imageflip}`}>
          <div className={`${styles.mainflip}`}>
            <div className={`${styles.frontside}`}>
              <div className="card border-0">
                <div className={styles.containerimg}>
                  {inmueble.imgs.length === 1 ? (
                    <Swiper>
                      <img className={styles.imgCard} src={inmueble.imgs[0]} />
                    </Swiper>
                  ) : (
                    <Swiper
                      effect={"cube"}
                      grabCursor
                      loop
                      autoplay={{
                        delay: 3200,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }}
                      cubeEffect={{
                        shadow: true,
                        slideShadows: true,
                        shadowOffset: 20,
                        shadowScale: 0.94,
                      }}
                      className="mySwiper"
                    >
                      {inmueble.imgs.map((img) => {
                        const sepracion = img.split(".");

                        const extension = sepracion[sepracion.length - 1];
                        const extensionesValidas = ["mp4"];
                        return (
                          <SwiperSlide key={img}>
                            {extensionesValidas.includes(extension) ? (
                              <video
                                src={img}
                                controls
                                controlsList="nodownload"
                                style={{
                                  height: 200,
                                  width: "100%",
                                  overflow: "hidden",
                                }}
                              />
                            ) : (
                              <img className={styles.imgCard} src={img} />
                            )}
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  )}
                </div>
                <div className="card-body">
                  <div className={`${styles.title}`}>{inmueble.titulo}</div>
                </div>
                </div>
            </div> 
            <div className={`${styles.backside}`}>
              <div className={`${styles.center} card`}>
                <div className="card-body">
                  <div className="my-3">
                    <span className={`${styles.operacion}`}>
                      {inmueble.categoria.nombre}
                    </span>
                  </div> 
                  <div className={`${styles.descripcion} my-4`}>
                      {inmueble.descripcion ? inmueble.descripcion : "Sin descripción"}
                  </div>
                  <div className={`${styles.precio} mt-3 mb-4`}>
                    {formatPrice(inmueble.precio)}
                  </div>
                  <div className="my-3">
                    <button
                      className={styles.btnDetalle}
                      onClick={() => handleProperty(inmueble._id, inmueble.slug)}
                    >
                      Ver detalles
                    </button>
                  </div> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </InfoWindow>
  );
};

export default InfoWindowMap;
