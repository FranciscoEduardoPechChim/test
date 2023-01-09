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
//Services
import { storeHistory } from '../../../services/historyService';
//Middlewares
import { isUser } from '../../../middlewares/roles';
//Material UI
import { Tooltip } from "@material-ui/core";

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
  }

  const handleOwner               = (owner: string) => {
    if(owner) {
      router.push(`/perfil/${owner}`);
    }
  }

  return (
    <InfoWindow position={{ lat: inmueble.lat, lng: inmueble.lng }} onCloseClick={() => handleClose()}>
      <div className={styles.contenedorCard}>
        <div className={`${styles.imageflip}`}>
          <div className={`${styles.mainflip}`}>
            <div className={`${styles.frontside}`}>
              <div className="card border-0">
                <div className={styles.containerimg}>
                  {(!inmueble.imgs) || (inmueble.imgs && (inmueble.imgs.length === 0)) &&
                    <Swiper>
                      <img className={styles.imgCard} src={'https://res.cloudinary.com/dhcyyvrus/image/upload/v1671216616/images/default_image_q4cpoa.jpg'} />
                      {/* <img className={styles.imgCard} src={(inmueble.imgs.length === 1) ? inmueble.imgs[0]:'/images/content/default_image.jpg'} /> */}
                    </Swiper>
                  }
                  {(inmueble.imgs) && (inmueble.imgs.length !== 0) && (inmueble.imgs.length === 1) ? (
                    <Swiper>
                      <img className={styles.imgCard} src={inmueble.imgs[0]} />
                    </Swiper>
                  ) : (
                    <Swiper
                      effect        = {"cube"}
                      grabCursor    = {true}
                      loop          = {true}
                      autoplay      ={{
                        delay:                500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter:    true,
                      }}
                      cubeEffect    ={{
                        shadow:       true,
                        slideShadows: true,
                        shadowOffset: 20,
                        shadowScale:  0.94,
                      }}
                      className     = "mySwiper"
                    >
                      {inmueble.imgs.map((img:any, key:number) => {
                        const sepracion           = img.split(".");
                        const extension           = sepracion[sepracion.length - 1];
                        const extensionesValidas  = ['mp4'];

                        return (
                          <SwiperSlide key={key}>
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
                  <div className={`${styles.title}`}>{(inmueble.titulo.length < 25) ? inmueble.titulo:(inmueble.titulo.substr(0, 25) + '...')}</div>
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
                  <div className={`${styles.descripcion} my-3`}>
                      {inmueble.descripcion ? inmueble.descripcion : "Sin descripción"}
                  </div>
                  <div className={`${styles.owner} my-2`}>
                    {(access_token && (typeof window !== "undefined") && (!isUser())) ?
                      <a onClick={() => handleOwner((typeof inmueble.usuario == 'string') ? inmueble.usuario:'')}>
                        {inmueble.owner ? inmueble.owner:"Sin propetario"}
                      </a>
                      :
                      <a style={{ color: '#5e5e5e'}}>
                        {inmueble.owner ? inmueble.owner:"Sin propetario"}
                      </a>
                    }
                  </div>
                  <div className={`${styles.precio} mt-2 mb-2`}>
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
