import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { obtenerUbicacionUsuario } from "helpers/obtenerUbicación";
import { Location } from "../../interfaces/MapInterfaces";
import { casasC, rentas } from "credentials";

interface ContextProps {
  coordenadas: Location;
  setCoordenadas: Dispatch<SetStateAction<Location>>;
  ubicacion: Location;
  setUbicacion: Dispatch<SetStateAction<Location>>;
  direccion: string | undefined;
  setDireccion: any;
  dirMapa: string | undefined;
  setDirMapa: any;
  zoom: number;
  setZoom: Dispatch<SetStateAction<number>>;
  southEast: Bounds;
  setSouthEast: Dispatch<SetStateAction<Bounds>>;
  northWest: Bounds;
  setNorthWest: Dispatch<SetStateAction<Bounds>>;
  southWest: google.maps.LatLngLiteral | undefined;
  setSouthWest: Dispatch<SetStateAction<google.maps.LatLngLiteral | undefined>>;
  northEast: google.maps.LatLngLiteral | undefined;
  setNorthEast: Dispatch<SetStateAction<google.maps.LatLngLiteral | undefined>>;
  ubicacionUsuario: Location;
  setUbicacionUsuario: Dispatch<SetStateAction<Location>>;
  categoria: string;
  tipoPropiedad: string;
  setCategoria: Dispatch<SetStateAction<string>>;
  setTipoPropiedad: Dispatch<SetStateAction<string>>;
  filtros: boolean;
  setFiltros: Dispatch<SetStateAction<boolean>>;
  ocultarBottomNav: boolean;
  setOcultarBottomNav: Dispatch<SetStateAction<boolean>>;
  minimoTerreno: number;
  maximoTerreno: number;
  setMinimoTerreno: Dispatch<SetStateAction<number>>;
  setMaximoTerreno: Dispatch<SetStateAction<number>>;
  minimoConstruidos: number;
  maximoConstruidos: number;
  setMinimoConstruidos: Dispatch<SetStateAction<number>>;
  setMaximoConstruidos: Dispatch<SetStateAction<number>>;
  minimoPrecio: number;
  maximoPrecio: number;
  setMinimoPrecio: Dispatch<SetStateAction<number>>;
  setMaximoPrecio: Dispatch<SetStateAction<number>>;
  identification: string;
  setIdentification: Dispatch<SetStateAction<string>>;
  status: boolean;
  setStatus: Dispatch<SetStateAction<boolean>>;
  agent: string;
  setAgent: Dispatch<SetStateAction<string>>;
  total: number;
  setTotal: Dispatch<SetStateAction<number>>;
  property: number;
  setProperty: Dispatch<SetStateAction<number>>;
}

export interface Bounds {
  lng: number | undefined;
  lat: number | undefined;
}

export const MapContext = createContext({} as ContextProps);

export const MapProvider: FC = ({ children }) => {
  const [coordenadas, setCoordenadas] = useState<Location>({
    lat: 19.4326078,
    lng: -99.133207,
  });
  // const [coordenadas, setCoordenadas] = useState<Location>({
  //   lat: 25.7825453,
  //   lng: -80.2994984,
  // });

  const [ubicacion, setUbicacion] = useState<Location>({
    lat: 19.4326077,
    lng: -99.133208,
  });

  // const [ubicacion, setUbicacion] = useState<Location>({
  //   lat: 25.7825453,
  //   lng: -80.2994984,
  // });

  const [ubicacionUsuario, setUbicacionUsuario] = useState<Location>({
    lat: 0,
    lng: 0,
  });
  const [southEast, setSouthEast] = useState<Bounds>({ lat: 0, lng: 0 });
  const [northWest, setNorthWest] = useState<Bounds>({ lat: 0, lng: 0 });
  const [southWest, setSouthWest] = useState<
    google.maps.LatLngLiteral | undefined
  >({ lat: 0, lng: 0 });
  const [northEast, setNorthEast] = useState<
    google.maps.LatLngLiteral | undefined
  >({ lat: 0, lng: 0 });

  const [direccion, setDireccion] = useState();
  //const [dirMapa, setDirMapa] = useState("Miami, Florida, EE. UU.");
  const [dirMapa, setDirMapa] = useState("Ciudad de México, CDMX, México");

  //const [zoom, setZoom] = useState(6);
  const [zoom, setZoom] = useState(5);

  const [categoria, setCategoria] = useState(rentas);
  const [tipoPropiedad, setTipoPropiedad] = useState(casasC);

  const [filtros, setFiltros] = useState(false);
  const [ocultarBottomNav, setOcultarBottomNav] = useState(true);

  const [minimoTerreno, setMinimoTerreno]         = useState(0);
  const [maximoTerreno, setMaximoTerreno]         = useState(10000);
  const [minimoConstruidos, setMinimoConstruidos] = useState(0);
  const [maximoConstruidos, setMaximoConstruidos] = useState(10000);
  const [minimoPrecio, setMinimoPrecio]           = useState(0);
  const [maximoPrecio, setMaximoPrecio]           = useState(10000000000);
  const [identification, setIdentification]       = useState('');
  const [status, setStatus]                       = useState(false);
  const [agent, setAgent]                         = useState('all');
  const [total, setTotal]                         = useState(0);
  const [property, setProperty]                   = useState(0);

  useEffect(() => {
    obtenerUbicacionUsuario().then((lngLat) => {
      setUbicacionUsuario({ lat: lngLat.lat, lng: lngLat.lng });
      setCoordenadas({ lat: lngLat.lat, lng: lngLat.lng });
    });
  }, []);

  useEffect(() => {
    coordenadas.lat !== 19.4326078 && coordenadas.lng !== -99.133207
      ? setZoom(12)
      : setZoom(5);
    // coordenadas.lat !== 25.7825453 && coordenadas.lng !== -80.2994984
    //   ? setZoom(12)
    //   : setZoom(6);

  }, [coordenadas]);

  return (
    <MapContext.Provider
      value={{
        coordenadas,
        setCoordenadas,
        ubicacion,
        setUbicacion,
        direccion,
        setDireccion,
        dirMapa,
        setDirMapa,
        zoom,
        setZoom,
        southEast,
        setSouthEast,
        northWest,
        setNorthWest,
        southWest,
        setSouthWest,
        northEast,
        setNorthEast,
        ubicacionUsuario,
        setUbicacionUsuario,
        categoria,
        setCategoria,
        tipoPropiedad,
        setTipoPropiedad,
        filtros,
        setFiltros,
        ocultarBottomNav,
        setOcultarBottomNav,
        setMaximoTerreno,
        setMinimoTerreno,
        minimoTerreno,
        maximoTerreno,
        setMaximoConstruidos,
        setMinimoConstruidos,
        minimoConstruidos,
        maximoConstruidos,
        setMinimoPrecio,
        minimoPrecio,
        setMaximoPrecio,
        maximoPrecio,
        identification,
        setIdentification,
        status,
        setStatus,
        agent,
        setAgent,
        total,
        setTotal,
        property,
        setProperty
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
