import { useContext, useEffect, useState } from "react";
import moment from "moment";
import { Bounds, MapContext } from "context/map/MapContext";
import {
  bodegasCat,
  casasC,
  departamentosCat,
  desarrollosCat,
  localesCat,
  oficinasCat,
  production,
  rentas,
  ventas,
} from "credentials";
import {
  InmueblesCoordenadas,
  InmueblesUsuario,
  InmuebleUsuarioRes,
  ListaInmuebles,
} from "interfaces/CrearInmuebleInterface";
import { Location } from "interfaces/MapInterfaces";
import { AllInmuebles, Inmueble } from "interfaces";

//Services
import { getPropertiesByCoords } from '../services/propertyService';

export const useInmuebles = () => {
  const { dirMapa } = useContext(MapContext);
  const [inmuebles, setInmuebles] = useState<InmueblesUsuario[]>();
  const [cargando, setCargando] = useState(true);

  const obtenerInmuebles = async () => {
    const resp = await fetch(
      `${production}/inmuebles/direccion?direccion=${dirMapa}`
    );
    const data = await resp.json();

    setInmuebles(data.inmuebles);
    setCargando(false);
  };

  useEffect(() => {
    obtenerInmuebles();
  }, [dirMapa]);

  return { inmuebles, cargando };
};

export const useListaInmueble = (limite: number) => {
  const { dirMapa } = useContext(MapContext);
  const [listaInmuebles, setListaInmuebles] = useState<ListaInmuebles>();
  const [cargando, setCargando] = useState(true);

  const obtenerInmuebles = async () => {
    const resp = await fetch(
      `${production}/inmuebles/lista-inmuebles?direccion=${dirMapa}&limite=${limite}`
    );
    const data: ListaInmuebles = await resp.json();

    setListaInmuebles(data);
    setCargando(false);
  };

  useEffect(() => {
    obtenerInmuebles();
  }, [dirMapa, limite]);

  return { listaInmuebles, cargando };
};

export const useInmueble = (id: string) => {
  const [inmueble, setInmueble] = useState<InmueblesUsuario>();
  const [cargando, setCargando] = useState(true);
  const [imgs, setImgs] = useState<string[]>([]);

  const obtenerInmueble = async () => {
    const res = await fetch(`${production}/inmuebles/${id}`);
    const data: InmuebleUsuarioRes = await res.json();

    setInmueble(data.inmueble);
    setImgs(data.inmueble.imgs);
    setCargando(false);
  };

  useEffect(() => {
    obtenerInmueble();
  }, []);

  return { inmueble, cargando, imgs, setImgs };
};

export const usePropertiesByCoords              = ( southEast: Bounds, northWest: Bounds, southWest: google.maps.LatLngLiteral | undefined, northEast: google.maps.LatLngLiteral | undefined, coords: Location, category: string, type: string, bathroom: number, parking: number, m2Property: number, m2Build: number, rooms: number, price: number) => {
  const [properties,setProperties]              = useState<any>([]);
  const [loading,setLoading]                    = useState(true);
  const { minimoTerreno, maximoTerreno, 
    minimoConstruidos, maximoConstruidos, 
    minimoPrecio, maximoPrecio}                 = useContext(MapContext);

    const init                                  = async () => {
      if(southEast && northEast && southWest && northEast && category && type) {
        const response                          = await getPropertiesByCoords(
                                                    (typeof southEast.lat == 'number' && (southEast.lat != 0)) ? southEast.lat:1, 
                                                    (typeof southEast.lng == 'number' && (southEast.lng != 0)) ? southEast.lng:1, 
                                                    (typeof southWest.lat == 'number' && (southWest.lat != 0)) ? southWest.lat:1, 
                                                    (typeof southWest.lng == 'number' && (southWest.lng != 0)) ? southWest.lng:1, 
                                                    (typeof northEast.lat == 'number' && (northEast.lat != 0)) ? northEast.lat:1, 
                                                    (typeof northEast.lng == 'number' && (northEast.lng != 0)) ? northEast.lng:1, 
                                                    (typeof northWest.lat == 'number' && (northWest.lat != 0)) ? northWest.lat:1,
                                                    (typeof northWest.lng == 'number' && (northWest.lng != 0)) ? northWest.lng:1, 
                                                    category, 
                                                    type);

        if(response && response.data) {
          const { data }                        = response;
          let propertiesTotal                   = data.properties;

          if((rooms >= 0) || (bathroom >= 0) || (parking >= 0) || (price >= 0) || (m2Property >= 0) || (m2Build >= 0)) {
            propertiesTotal                     = (data.properties).filter((property:any) => {
              if((rooms >= 0) && (property.habitaciones >= rooms)) {
                return property;
              }
              if((bathroom >= 0) && (property.baños >= rooms)) {
                return property;
              }
              if((parking >= 0) && (property.parking >= parking)) {
                return property;
              }
              if((price >= 0) && (property.precio >= minimoPrecio && property.precio <= maximoPrecio)) {
                return property;
              }
              if((m2Property >= 0) && (property.m2Terreno >= minimoTerreno && property.m2Terreno <= maximoTerreno)) {
                return property;
              }
              if((m2Build >= 0) && (property.m2Construidos >= minimoConstruidos && property.m2Construidos <= m2Build)) {
                return property;
              }
            });
          }

          propertiesTotal                       = propertiesTotal.filter((property:any) => {
            if(property.publicado == true){
              return property;
            }
          });

          setProperties(propertiesTotal);
          setLoading(false);
        }
      }
    }

    useEffect(() => {
      init();
    }, [
      southEast,
      northWest,
      southWest,
      northEast,
      coords,
      type,
      category,
      bathroom,
      parking,
      rooms,
      minimoTerreno,
      maximoTerreno,
      minimoConstruidos,
      maximoConstruidos,
      minimoPrecio,
      maximoPrecio,
    ]);

    return { 
      inmuebles: properties, 
      cargando: loading 
    };
}

export const useInmueblesCoordenadas = (
  southEast: Bounds,
  northWest: Bounds,
  southWest: google.maps.LatLngLiteral | undefined,
  northEast: google.maps.LatLngLiteral | undefined,
  coordenadas: Location,
  categoria: string,
  tipoPropiedad: string,
  banos: number,
  parking: number,
  m2Terreno: number,
  m2Construidos: number,
  habitaciones: number,
  precio: number,
) => {
  const [inmuebles, setInmuebles] = useState<InmueblesUsuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const { minimoTerreno, maximoTerreno, minimoConstruidos, maximoConstruidos, minimoPrecio, maximoPrecio} = useContext(MapContext);

  const obtenerInmueblesPorCoordenadas = async () => {
    try {
      const resp = await fetch(
        `${production}/inmuebles/inmuebles/coordenadas?lat_south_east=${southEast.lat}&lng_south_east=${southEast.lng}&lat_south_west=${southWest?.lat}&lng_south_west=${southWest?.lng}&lat_north_east=${northEast?.lat}&lng_north_east=${northEast?.lng}&lat_north_west=${northWest.lat}&lng_north_west=${northWest.lng}&categoria=${categoria}&tipoPropiedad=${tipoPropiedad}`
      );
      const data: InmueblesCoordenadas = await resp.json();
      var inmueblesFiltrados = data.inmuebles;

      if (habitaciones >= 0) {
        inmueblesFiltrados = inmueblesFiltrados.filter((inmueble) => inmueble.habitaciones >= habitaciones);
      }

      if (banos >= 0) {
        inmueblesFiltrados = inmueblesFiltrados.filter((inmueble) => inmueble.baños >= banos);
      }

      if (parking >= 0) {
        inmueblesFiltrados = inmueblesFiltrados.filter((inmueble) => inmueble.parking >= parking);
      }

      if (precio >= 0) {
        inmueblesFiltrados = inmueblesFiltrados.filter((inmueble) => inmueble.precio >= minimoPrecio && inmueble.precio <= maximoPrecio)
      }

      if (m2Terreno >= 0) {
        inmueblesFiltrados = inmueblesFiltrados.filter((inmueble) => inmueble.m2Terreno >= minimoTerreno && inmueble.m2Terreno <= maximoTerreno);
      }

      if (m2Construidos >= 0) {
        inmueblesFiltrados = inmueblesFiltrados.filter((inmueble) => inmueble.m2Construidos >= minimoConstruidos && inmueble.m2Construidos <= m2Construidos);
      }

      setInmuebles(inmueblesFiltrados);
      setCargando(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    obtenerInmueblesPorCoordenadas();
  }, [
    southEast,
    northWest,
    southWest,
    northEast,
    coordenadas,
    tipoPropiedad,
    categoria,
    banos,
    parking,
    habitaciones,
    minimoTerreno,
    maximoTerreno,
    minimoConstruidos,
    maximoConstruidos,
    minimoPrecio,
    maximoPrecio,
  ]);

  return { inmuebles, cargando };
};

export const useListaInmuebleCoords = (
  limite: number,
  southEast: Bounds,
  northWest: Bounds,
  southWest: google.maps.LatLngLiteral | undefined,
  northEast: google.maps.LatLngLiteral | undefined,
  coordenadas: Location,
  categoria: string,
  tipoPropiedad: string
) => {
  const [listaInmuebles, setListaInmuebles] = useState<ListaInmuebles>();
  const [cargando, setCargando] = useState(true);

  const obtenerInmuebles = async () => {
    try {
      const resp = await fetch(
        `${production}/inmuebles/lista-inmuebles/coordenadas?lat_south_east=${southEast.lat}&lng_south_east=${southEast.lng}&lat_south_west=${southWest?.lat}&lng_south_west=${southWest?.lng}&lat_north_east=${northEast?.lat}&lng_north_east=${northEast?.lng}&lat_north_west=${northWest.lat}&lng_north_west=${northWest.lng}&limite=${limite}&categoria=${categoria}&tipoPropiedad=${tipoPropiedad}`
      );
      const data: ListaInmuebles = await resp.json();

      setListaInmuebles(data);
      setCargando(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerInmuebles();
  }, [
    southEast,
    northWest,
    southWest,
    northEast,
    coordenadas,
    tipoPropiedad,
    categoria,
  ]);

  return { listaInmuebles, cargando };
};

export const useAllInmuebles = () => {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [cargando, setCargando] = useState(true);
  const [total, setTotal] = useState(0);

  const obtenerInmuebles = async () => {
    const res = await fetch(`${production}/inmuebles`);
    const data: AllInmuebles = await res.json();

    setTotal(data.total);
    setInmuebles(data.inmuebles);
    setCargando(false);
  };

  useEffect(() => {
    obtenerInmuebles();
  }, []);

  return { inmuebles, cargando, total };
};

export const useTipoInmueble = () => {
  const [casas, setCasas] = useState(0);
  const [departamentos, setDepartamentos] = useState(0);
  const [bodegas, setBodegas] = useState(0);
  const [desarrollos, setDesarrollos] = useState(0);
  const [locales, setLocales] = useState(0);
  const [oficinas, setOficinas] = useState(0);

  const obtenerTotalCasas = async () => {
    const res = await fetch(
      `${production}/inmuebles/inmuebles/tipo-propiedad?tipoPropiedad=${casasC}`
    );
    const data = await res.json();

    setCasas(data.total);
  };

  const obtenerTotalDepartamentos = async () => {
    const res = await fetch(
      `${production}/inmuebles/inmuebles/tipo-propiedad?tipoPropiedad=${departamentosCat}`
    );
    const data = await res.json();

    setDepartamentos(data.total);
  };

  const obtenerTotalBodegas = async () => {
    const res = await fetch(
      `${production}/inmuebles/inmuebles/tipo-propiedad?tipoPropiedad=${bodegasCat}`
    );
    const data = await res.json();

    setBodegas(data.total);
  };

  const obtenerTotalDesarrollos = async () => {
    const res = await fetch(
      `${production}/inmuebles/inmuebles/tipo-propiedad?tipoPropiedad=${desarrollosCat}`
    );
    const data = await res.json();

    setDesarrollos(data.total);
  };

  const obtenerTotalLocales = async () => {
    const res = await fetch(
      `${production}/inmuebles/inmuebles/tipo-propiedad?tipoPropiedad=${localesCat}`
    );
    const data = await res.json();

    setLocales(data.total);
  };

  const obtenerTotalOficinas = async () => {
    const res = await fetch(
      `${production}/inmuebles/inmuebles/tipo-propiedad?tipoPropiedad=${oficinasCat}`
    );
    const data = await res.json();

    setOficinas(data.total);
  };

  useEffect(() => {
    obtenerTotalCasas();
    obtenerTotalDepartamentos();
    obtenerTotalBodegas();
    obtenerTotalDesarrollos();
    obtenerTotalLocales();
    obtenerTotalOficinas();
  }, []);

  return { casas, departamentos, bodegas, desarrollos, locales, oficinas };
};

export const useCategoriaInmueble = () => {
  const [renta, setRenta] = useState(0);
  const [venta, setVenta] = useState(0);

  const obtenerTotalRenta = async () => {
    const res = await fetch(
      `${production}/inmuebles/inmuebles/categoria?categoria=${rentas}`
    );
    const data = await res.json();

    setRenta(data.total);
  };

  const obtenerTotalVenta = async () => {
    const res = await fetch(
      `${production}/inmuebles/inmuebles/categoria?categoria=${ventas}`
    );
    const data = await res.json();

    setVenta(data.total);
  };

  useEffect(() => {
    obtenerTotalRenta();
    obtenerTotalVenta();
  }, []);

  return { renta, venta };
};

export const useFechaInmueble = () => {
  const [hoy, setHoy] = useState(0);
  const [semana, setSemana] = useState(0);
  const [mes, setMes] = useState(0);

  const obtenerInmueblesHoy = async () => {
    const today = moment().startOf("day");

    const res = await fetch(
      `${production}/inmuebles/inmuebles/fecha?createdAt=${Number(today)}`
    );
    const data = await res.json();

    setHoy(data.total);
  };

  const obtenerInmueblesSemana = async () => {
    const today = moment().startOf("day");
    const week = today.subtract(7, "day");
    const res = await fetch(
      `${production}/inmuebles/inmuebles/fecha?createdAt=${Number(week)}`
    );
    const data = await res.json();

    setSemana(data.total);
  };

  const obtenerInmueblesMes = async () => {
    const today = moment().startOf("day");
    const month = today.subtract(30, "days");
    const res = await fetch(
      `${production}/inmuebles/inmuebles/fecha?createdAt=${Number(month)}`
    );
    const data = await res.json();

    setMes(data.total);
  };

  useEffect(() => {
    obtenerInmueblesHoy();
    obtenerInmueblesSemana();
    obtenerInmueblesMes();
  }, []);

  return { hoy, semana, mes };
};
