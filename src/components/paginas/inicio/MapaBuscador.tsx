import { Fragment, memo, useContext, useEffect, useRef, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { MapContext } from "../../../context/map/MapContext";
import { useInmueblesCoordenadas } from "../../../hooks/useInmuebles";
import Loading from "../../ui/loading/Loading";
import InfoWindowMap from "./InfoWindowMap";
import BuscarZona from "./BuscarZona";
import { useCategories, useTipoPropiedad } from "hooks/useCategories";
import BarraCategorias from "./BarraCategorias";
import styles from "./BarraCategoria.module.css";

//Hooks
import { usePropertiesByCoords } from '../../../hooks/useInmuebles';
//Context
import { AuthContext } from "context/auth/AuthContext";
//Components
import InfoWindowMapRealEstate from './InfoWindowMapRealEstate';
import { init } from "linkifyjs";

const containerStyle = {
  width: "100%",
  height: "87vh",
};

const options = {
  disableDefaultUI: true,
  streetViewControl: true,
  zoomControl: true,
  fullscreenControl: false,
};

const MapaUbicacion = () => {
  const {
    coordenadas,
    zoom,
    setCoordenadas,
    setSouthEast,
    setNorthWest,
    setSouthWest,
    setNorthEast,
    categoria,
    tipoPropiedad,
    setCategoria,
    setTipoPropiedad,
    filtros,
    property,
    
  } = useContext(MapContext);
  const [set, setSet]                   = useState('');
  const [seleccionado, setSeleccionado] = useState('');
  const [status,setStatus]              = useState(false);
  const [agent, setAgent]               = useState('all');
  const [banos, setBanos]               = useState(0)
  const [parking, setParking]           = useState(0)
  const [habitaciones, setHabitaciones] = useState(0)
  const { loading, propertyTypes }      = useTipoPropiedad();
  const { categorias }                  = useCategories();
  const { auth }                        = useContext(AuthContext);
  const mapRef                          = useRef<GoogleMap>(null);
  const { inmuebles, cargando }         = usePropertiesByCoords(
    categoria,
    tipoPropiedad,
    banos,
    parking,
    habitaciones,
    set,
    status,
    agent,
    (auth && auth.uid) ? auth.uid:'all'
  );

  const selectOption                    = (id: string, lat: number, lng:number) => {
    if(id && String(lat) && String(lng)) {
      setCoordenadas({ lat: lat, lng: lng });
      setSeleccionado(id);
    }
  }
  const closeInfoWindow                 = () => setSeleccionado("");

  const onBoundsChange                  = () => {
    const southWest = mapRef.current?.state.map
      ?.getBounds()
      ?.getSouthWest()
      .toJSON();

    const northEast = mapRef.current?.state.map
      ?.getBounds()
      ?.getNorthEast()
      .toJSON();

    const northWest = {
      lat: mapRef.current?.state.map?.getBounds()?.getNorthEast().lat(),
      lng: mapRef.current?.state.map?.getBounds()?.getSouthWest().lng(),
    };

    const southEast = {
      lat: mapRef.current?.state.map?.getBounds()?.getSouthWest().lat(),
      lng: mapRef.current?.state.map?.getBounds()?.getNorthEast().lng(),
    };

    setSouthEast(southEast);
    setNorthWest(northWest);
    setSouthWest(southWest);
    setNorthEast(northEast);
  };

  const handleClick                     = () => {
    onBoundsChange();
    getCenter();
  };

  const getCenter                       = () => {
    const center = mapRef.current?.state.map?.getCenter()?.toJSON();
    setCoordenadas(center!);
  };

  useEffect(() => {
    onBoundsChange();
  }, []);

  return (
    <>
        <GoogleMap
            ref               = {mapRef}
            mapContainerStyle = {containerStyle}
            center={{
              lat: coordenadas.lat,
              lng: coordenadas.lng,
            }}
            onClick           = {closeInfoWindow}
            zoom              = {zoom}
            options           = {options}
        >
              <div onClick={handleClick}>
                <BuscarZona total={inmuebles.length} loading={cargando} />

                <div
                  className={
                    filtros
                      ? styles.barraCategorias
                      : styles.barraCategoriasInactive
                  }
                >
                  {loading ? (
                    <Loading />
                  ) : (
                    <BarraCategorias
                      setTipoPropiedad    = {setTipoPropiedad}
                      propertyTypes       = {propertyTypes}
                      setCategoria        = {setCategoria}
                      categorias          = {categorias}
                      banos               = {banos}
                      setBanos            = {setBanos}
                      parking             = {parking}
                      setParking          = {setParking}
                      habitaciones        = {habitaciones}
                      setHabitaciones     = {setHabitaciones}
                      set                 = {set}
                      setSet              = {setSet}
                      status              = {status}
                      setStatus           = {setStatus}
                      agent               = {agent}
                      setAgent            = {setAgent}
                    />
                  )} 
                </div>
              </div> 

              {inmuebles && (inmuebles.length != 0) && inmuebles.map((inmueble:any, key:any) => {
                return (
                  <Fragment key={key}>
                    {(property == 0)  ?
                      <Marker
                        animation={2}
                        position={{ lat: (inmueble && inmueble.lat) ? inmueble.lat:0, lng: (inmueble && inmueble.lng) ? inmueble.lng:0 }}
                        icon={{
                          //url: "/images/icons/marcador.svg",
                          url: "https://res.cloudinary.com/dhcyyvrus/image/upload/v1669233956/images/Marcador_yzfk4y.png",
                          scaledSize: new google.maps.Size(50, 50),
                        }}
                        onClick={() =>
                          selectOption(
                            inmueble._id,
                            inmueble.lat,
                            inmueble.lng
                          )
                        }
                      >
                        {((seleccionado === inmueble._id)) ? (
                        <InfoWindowMap inmueble={inmueble} handleClose={closeInfoWindow}/>
                        ) : null}
                      </Marker>:
                      <Marker
                        animation={2}
                        position={{ lat: (inmueble && inmueble.lat) ? inmueble.lat:0, lng: (inmueble && inmueble.lng) ? inmueble.lng:0 }}
                        icon={{
                          //url: "/images/icons/marcador.svg",
                          url: "https://res.cloudinary.com/dhcyyvrus/image/upload/v1669233956/images/Marcador_yzfk4y.png",
                          scaledSize: new google.maps.Size(50, 50),
                        }}
                        onClick={() =>
                          selectOption(
                            inmueble.uid,
                            inmueble.lat,
                            inmueble.lng
                          )
                        }
                      >
                        {(seleccionado === inmueble.uid) &&
                          <InfoWindowMapRealEstate realEstate={inmueble} handleClose={closeInfoWindow} />
                        }
                      </Marker>
                    }
                  </Fragment>
                );
              })}
        </GoogleMap>
    </>
  );
};

export default memo(MapaUbicacion);
