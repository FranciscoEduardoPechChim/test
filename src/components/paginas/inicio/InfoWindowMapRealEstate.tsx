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
import { Auth } from "interfaces/AuthInterface";

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
  realEstate: Auth;
  handleClose: () => void;
}

const InfoWindowMapRealEstate     = ({ realEstate, handleClose }: Props) => {
  const router                    = useRouter();

  const handleOwner               = (owner: string) => {
    if(owner) {
      router.push(`/perfil/${owner}`);
    }
  }

  return (
    <InfoWindow position={{ lat: (typeof realEstate.lat == 'number') ? realEstate.lat:0, lng: (typeof realEstate.lng == 'number') ? realEstate.lng:0 }} onCloseClick={() => handleClose()}>
      <div className={styles.contenedorCard}>
        <div className={`${styles.imageflip}`}>
          <div className={`${styles.mainflip}`}>
            <div className={`${styles.frontside}`}>
              <div className="card border-0">
                <div className={styles.containerimg}>
                  <Swiper>
                    <img className={styles.imgCard} src={(realEstate) ? realEstate.img:''} />                    
                  </Swiper>
                </div>
                <div className="card-body">
                  <div className={`${styles.title}`}>
                    {(!realEstate.nombreInmobiliaria) ? 
                    'Inmobilaria sin nombre': 
                    ((typeof realEstate.nombreInmobiliaria == 'string') && ((realEstate.nombreInmobiliaria.length < 25) ? realEstate.nombreInmobiliaria:(realEstate.nombreInmobiliaria.substr(0, 25) + '...')))
                    }
                  </div>
                </div>
              </div>
            </div> 
            <div className={`${styles.backside}`}>
              <div className={`${styles.center} card`}>
                <div className="card-body">
                  <div className="my-3">
                    <span className={`${styles.operacion}`}>
                      Inmobilarias
                    </span>
                  </div> 
                  <div className={`${styles.ownerRealEstate} my-4`}>
                    {(realEstate.nombre && realEstate.apellido) ? (realEstate.nombre + ' ' + realEstate.apellido):"Sin nombre completo no existe"}
                  </div>
                  <div className={`${styles.descripcion} my-4`}>
                      {(realEstate.perfilEmpresarial) ? realEstate.perfilEmpresarial:'Sin perfil empresarial'}
                  </div>
                  <div className="my-4">
                    <button
                      className={styles.btnDetalle}
                      onClick={() =>handleOwner((realEstate && realEstate.uid) ? realEstate.uid:'')}
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

export default InfoWindowMapRealEstate;
