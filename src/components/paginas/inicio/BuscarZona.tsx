import { MapContext } from "context/map/MapContext";
import { useContext } from "react";
import styles from "./Inicio.module.css";
import Loading from "components/ui/loading/Loading";

interface Props {
  total:    number,
  loading:  boolean
}

const BuscarZona = ({total, loading}: Props) => {
  const { filtros } = useContext(MapContext);
  return (
    <div
      className={`${
        filtros ? styles.buscarZonaWithFilter : styles.buscarZona
      } pointer text-center`}
    >
      <div className="row">
        <div className="col-12">
          Buscar en esta zona 
        </div>
      </div>
      <div className="row my-1">
        <div className="col-12">
           Cantidad: {total}
        </div>    
      </div>

    </div>
  );
};

export default BuscarZona;
