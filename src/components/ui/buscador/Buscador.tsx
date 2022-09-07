import { useContext, useRef } from "react";
import { useRouter } from "next/router";
import Geosuggest, { Suggest } from "react-geosuggest";
import { MapContext } from "../../../context/map/MapContext";
import styles from "./Buscador.module.css";

const Buscador = () => {
  const geosuggestEl = useRef<Geosuggest>(null);
  const router = useRouter();
  const { setFiltros, filtros } = useContext(MapContext);

  const { setCoordenadas, setDirMapa, setZoom } = useContext(MapContext);
  const mostrarFiltros = () => setFiltros(true);

  const onSuggestSelect = (suggest: Suggest) => {
    !suggest
      ? setCoordenadas({ lat: 19.4326077, lng: -99.133208 })
      : setCoordenadas({
        lat: suggest.location.lat,
        lng: suggest.location.lng,
      });

    router.push("/");

    !suggest ? setDirMapa(null) : setDirMapa(suggest.label);

    !suggest ? setZoom(5) : setZoom(12);
  };

  return (
    <Geosuggest
      onFocus={mostrarFiltros}
      ref={geosuggestEl}
      queryDelay={530}
      country="mx"
      placeholder="Busca aquí..."
      onSuggestSelect={onSuggestSelect}
      autoComplete="off"
      inputClassName={styles.buscador}
      suggestsClassName={styles.respuesta}
      suggestItemClassName={styles.item}
    />
  );
};

export default Buscador;
