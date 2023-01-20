import { createContext, Dispatch, FC, SetStateAction, useState, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  InmueblesResponse,
  SubirImagenesInmueble,
  Inmueble
} from "interfaces/InmueblesInterface";
import {
  BorrarInmuebleResp,
  CrearInmuebleResp, 
} from "interfaces/CrearInmuebleInterface";
import {
  fetchActualizarInmueble,
  fetchBorrarInmueble,
  fetchInmueble,
  subirFotosInmueble,
} from "helpers/fetch";
import { Estado } from "interfaces/SolicitudInteface";

//Helpers
import { validate } from '../../helpers/response';
//Services
import { storeProperty, updateImagesExists, updateProperty, getProperty, validAliasInProperty, loadImagesProperty, destroyProperty, updatePropertyByStatus } from "../../services/propertyService";
//Content
import { SocketContext } from "context/socket/SocketContext";
import { AuthContext } from "context/auth/AuthContext";

export interface InmuebleData {
  titulo: string;
  categoria: string;
  precio: number;
  direccion: string | undefined;
  lat: number;
  lng: number;
  tipoPropiedad: string;
  descripcion?: string;
  AA?: boolean;
  agua?: boolean;
  amueblado?: boolean;
  antiguedad?: string;
  baños?: number;
  camas?: boolean;
  closet?: boolean;
  cocina?: boolean;
  comedor?: boolean;
  comisiones?: number;
  discapacitados?: boolean;
  escuelas?: boolean;
  estufa?: boolean;
  gas?: boolean;
  habitaciones?: number;
  horno?: boolean;
  internet?: boolean;
  lavadora?: boolean;
  luz?: boolean;
  m2Construidos?: number;
  m2Terreno?: number;
  mantenimiento?: boolean;
  medioBaños?: number;
  microondas?: boolean;
  minihorno?: boolean;
  otros?: string;
  parking?: number;
  piscinas?: boolean;
  pisos?: number;
  refrigerador?: boolean;
  sala?: boolean;
  secadora?: boolean;
  seguridadPrivada?: boolean;
  set?: string;
  alias?: string;
}

export interface ActualizarInmueble {
  titulo?: string;
  categoria?: string;
  precio?: number;
  direccion?: string | undefined;
  lat?: number;
  lng?: number;
  tipoPropiedad?: string;
  descripcion?: string;
  AA?: boolean;
  agua?: boolean;
  amueblado?: boolean;
  antiguedad?: string;
  baños?: number;
  camas?: boolean;
  closet?: boolean;
  cocina?: boolean;
  comedor?: boolean;
  comisiones?: number;
  discapacitados?: boolean;
  escuelas?: boolean;
  estufa?: boolean;
  gas?: boolean;
  habitaciones?: number;
  horno?: boolean;
  internet?: boolean;
  lavadora?: boolean;
  luz?: boolean;
  m2Construidos?: number;
  m2Terreno?: number;
  mantenimiento?: boolean;
  medioBaños?: number;
  microondas?: boolean;
  minihorno?: boolean;
  otros?: string;
  publicado?: boolean;
  parking?: number;
  piscinas?: boolean;
  pisos?: number;
  refrigerador?: boolean;
  sala?: boolean;
  secadora?: boolean;
  seguridadPrivada?: boolean;
  imgs?: string[];
}

interface ContextProps {
  createProperty: (title: string, categoryId: string, typeId: string, setId: string, alias: string | null, lat: number, lng: number, price: number, commission: number, antiquity: string | null, 
    m2Property: number, baths: number, parking: number, water: boolean | null, gas: boolean | null, privatesecurity: boolean | null, maintenance: boolean | null, disabled: boolean | null, m2Build: number, rooms: number, halfbaths: number,
    level: number, light: boolean | null, wifi: boolean | null, school: boolean | null, swimmingpool: boolean | null, furnished: boolean, beds: boolean | null, livingroom: boolean | null, kitchen: boolean | null, refrigerator: boolean | null,
    microwave: boolean | null, oven: boolean | null, dryingmachine: boolean | null, closet: boolean | null, diningroom: boolean | null, aa: boolean | null, stove: boolean | null, minioven: boolean | null, washingmachine: boolean | null,
    others: string | null, address: string, description: string, userId: string, images: any, access_token: string) => Promise<boolean | undefined>;
  validAlias: (id: string, access_token: string) => Promise<boolean | undefined>;
  removeProperty: (pid: string, access_token: string) => Promise<boolean | undefined>;
  changeStatusProperty: (pid: string, status: boolean, access_token: string) => Promise<boolean | undefined>;
  showProperty: (pid: string, access_token: string) => Promise<Inmueble | undefined>;
  editProperty: (id: string, title: string, categoryId: string, typeId: string, setId: string, alias: string | null, lat: number, lng: number, price: number, commission: number, antiquity: string | null, 
    m2Property: number, baths: number, parking: number, water: boolean | null, gas: boolean | null, privatesecurity: boolean | null, maintenance: boolean | null, disabled: boolean | null, m2Build: number, rooms: number, halfbaths: number,
    level: number, light: boolean | null, wifi: boolean | null, school: boolean | null, swimmingpool: boolean | null, furnished: boolean, beds: boolean | null, livingroom: boolean | null, kitchen: boolean | null, refrigerator: boolean | null,
    microwave: boolean | null, oven: boolean | null, dryingmachine: boolean | null, closet: boolean | null, diningroom: boolean | null, aa: boolean | null, stove: boolean | null, minioven: boolean | null, washingmachine: boolean | null,
    others: string | null, address: string, description: string, userId: string, images: any, remove: any, sort: any, access_token: string) => Promise<boolean | undefined>;
  crearInmueble: (data: InmuebleData) => Promise<CrearInmuebleResp>;
  eliminarInmueble: (id: string) => Promise<BorrarInmuebleResp>;
  subirImagenesInmueble: (
    data: any,
    uid: string | null | undefined,
    pid: string | undefined,
    endpoint: string
  ) => Promise<SubirImagenesInmueble>;
  orden: string;
  setOrden: Dispatch<SetStateAction<string>>;
  user: string;
  setUser: Dispatch<SetStateAction<string>>;
  solicitud: string;
  setSolicitud: Dispatch<SetStateAction<string>>;
  actualizarInmueble: (
    data: ActualizarInmueble,
    pid: string
  ) => Promise<InmueblesResponse>;
  editar: EditarInmueble | undefined;
  setEditar: Dispatch<SetStateAction<EditarInmueble | undefined>>;
  idInmueble: string;
  setIdInmueble: Dispatch<SetStateAction<string>>;
  inmuebleState: ActualizarInmueble;
  setInmuebleState: Dispatch<SetStateAction<ActualizarInmueble>>;
  dueño: string;
  setDueño: Dispatch<SetStateAction<string>>;
  estado: Estado | string;
  setEstado: Dispatch<SetStateAction<Estado | string>>;
  misCompUser: string;
  setMisCompUser: Dispatch<SetStateAction<string>>;
  userFavorite: string;
  setUserFavorite: Dispatch<SetStateAction<string>>;
  status: number;
  setStatus: Dispatch<SetStateAction<number>>;
  userId: string;
  setUserId: Dispatch<SetStateAction<string>>;
}

type EditarInmueble = "Información" | "Imágenes";

export const InmuebleContext = createContext({} as ContextProps);

const InmuebleState: ActualizarInmueble = {
  titulo: undefined,
  categoria: undefined,
  precio: undefined,
  direccion: undefined,
  lat: undefined,
  lng: undefined,
  tipoPropiedad: undefined,
  descripcion: undefined,
  AA: undefined,
  agua: undefined,
  amueblado: undefined,
  antiguedad: undefined,
  baños: undefined,
  camas: undefined,
  closet: undefined,
  cocina: undefined,
  comedor: undefined,
  comisiones: undefined,
  discapacitados: undefined,
  escuelas: undefined,
  estufa: undefined,
  gas: undefined,
  habitaciones: undefined,
  horno: undefined,
  internet: undefined,
  lavadora: undefined,
  luz: undefined,
  m2Construidos: undefined,
  m2Terreno: undefined,
  mantenimiento: undefined,
  medioBaños: undefined,
  microondas: undefined,
  minihorno: undefined,
  otros: undefined,
  publicado: undefined,
  parking: undefined,
  piscinas: undefined,
  pisos: undefined,
  refrigerador: undefined,
  sala: undefined,
  secadora: undefined,
};

export const InmuebleProvider: FC         = ({ children }) => {
  const [user,setUser]                    = useState<string>('all');
  const [userId, setUserId]               = useState('all');
  const [userFavorite, setUserFavorite]   = useState('');
  const { socket }                        = useContext(SocketContext);
  const { auth }                          = useContext(AuthContext);
  const [orden, setOrden]                 = useState<string>("createdAt");
  const [solicitud, setSolicitud]         = useState("Pendiente");
  const [editar, setEditar]               = useState<EditarInmueble>();
  const [idInmueble, setIdInmueble]       = useState("");
  const [inmuebleState, setInmuebleState] = useState(InmuebleState);
  const [dueño, setDueño]                 = useState("");
  const [estado, setEstado]               = useState<Estado | string>("Aprobado");
  const [misCompUser, setMisCompUser]     = useState("");
  const [status, setStatus]               = useState(0);

  const crearInmueble = async (data: InmuebleData) => {
    const resp = await fetchInmueble("inmuebles", data);

    if (resp.ok) {
      toast.success(resp.msg);
      toast.success("Ahora agrega las imágenes de tu inmueble");
    }

    if (resp.errors) {
      resp.errors.map((e) => {
        return toast.error(e.msg);
      });
    }
    return resp;
  };

  const subirImagenesInmueble = async (
    data: any,
    uid: string | null | undefined,
    pid: string | undefined,
    endpoint = ""
  ) => {
    const resp = await subirFotosInmueble(
      `subidas/${endpoint}${uid}/${pid}`,
      data
    );

    if (resp.ok) {
      toast.success(resp.msg);
    }

    if (!resp.ok) {
      toast.error(
        "Hubo un error al momento de subir las imágenes. Inténtelo nuevamente"
      );
    }

    return resp;
  };

  const eliminarInmueble = async (id: string) => {
    const resp = await fetchBorrarInmueble(`inmuebles/${id}`);

    toast.success(resp.msg);
    return resp;
  };

  const actualizarInmueble = async (data: ActualizarInmueble, pid: string) => {
    const resp = await fetchActualizarInmueble(`inmuebles/${pid}`, data);
    if (resp.ok) {
      toast.success(resp.msg);
    }
    if (!resp.ok) {
      toast.error(resp.msg);
    }

    return resp;
  };

  const createProperty                          = async (title: string, categoryId: string, typeId: string, setId: string, alias: string | null, lat: number, lng: number, price: number, commission: number, antiquity: string | null, 
    m2Property: number, baths: number, parking: number, water: boolean | null, gas: boolean | null, privatesecurity: boolean | null, maintenance: boolean | null, disabled: boolean | null, m2Build: number, rooms: number, halfbaths: number,
    level: number, light: boolean | null, wifi: boolean | null, school: boolean | null, swimmingpool: boolean | null, furnished: boolean, beds: boolean | null, livingroom: boolean | null, kitchen: boolean | null, refrigerator: boolean | null,
    microwave: boolean | null, oven: boolean | null, dryingmachine: boolean | null, closet: boolean | null, diningroom: boolean | null, aa: boolean | null, stove: boolean | null, minioven: boolean | null, washingmachine: boolean | null,
    others: string | null, address: string, description: string, userId: string, images: any, access_token: string) => {
      if(title && categoryId && typeId && setId && lat && lng && address && String(price) && String(commission) && String(m2Property) && String(baths) && String(parking) && String(m2Build) && String(rooms) && String(halfbaths) && description && userId && access_token) {
 
        const response                          = await storeProperty(title, categoryId, typeId, setId, alias, lat, lng, price, commission, antiquity, m2Property, baths, parking, water, gas, privatesecurity, maintenance, disabled, m2Build, rooms, halfbaths, level, light, wifi, school, swimmingpool, furnished, beds, livingroom, kitchen, refrigerator, microwave, oven, dryingmachine, closet, diningroom, aa, stove, minioven, washingmachine, others, address, description, userId, images.length, access_token);

        if(response && response.errors) {
            validate(response.errors);
            return false;
        }

        if(response && response.ok) {
            toast.error(response.msg);
            return false;
        }

        if(response && auth && auth.uid && response.data) {
          if(images.length > 0) {
            const load                          = await loadImagesProperty('create', userId, response.data.properties[0]._id, images, [], [], access_token);

            if(load && load.errors) {
              validate(load.errors);
              return false;
            }

            if(load && load.ok) {
                toast.error(load.msg);
                return false;
            }
          }

          socket?.emit("property", response.data.properties[0]);
          toast.success(response.msg);
          return true;
        }
      }

    return false;
  }

  const editProperty                            = async (id: string, title: string, categoryId: string, typeId: string, setId: string, alias: string | null, lat: number, lng: number, price: number, commission: number, antiquity: string | null, 
    m2Property: number, baths: number, parking: number, water: boolean | null, gas: boolean | null, privatesecurity: boolean | null, maintenance: boolean | null, disabled: boolean | null, m2Build: number, rooms: number, halfbaths: number,
    level: number, light: boolean | null, wifi: boolean | null, school: boolean | null, swimmingpool: boolean | null, furnished: boolean, beds: boolean | null, livingroom: boolean | null, kitchen: boolean | null, refrigerator: boolean | null,
    microwave: boolean | null, oven: boolean | null, dryingmachine: boolean | null, closet: boolean | null, diningroom: boolean | null, aa: boolean | null, stove: boolean | null, minioven: boolean | null, washingmachine: boolean | null,
    others: string | null, address: string, description: string, userId: string, images: any, remove: any, sort:any, access_token: string) => {
    
      if(id && title && categoryId && typeId && setId && lat && lng && address && String(price) && String(commission) && String(m2Property) && String(baths) && String(parking) && String(m2Build) && String(rooms) && String(halfbaths) && description && userId && access_token) {

        const response                          = await updateProperty(id, title, categoryId, typeId, setId, alias, lat, lng, price, commission, antiquity, m2Property, baths, parking, water, gas, privatesecurity, maintenance, disabled, m2Build, rooms, halfbaths, level, light, wifi, school, swimmingpool, furnished, beds, livingroom, kitchen, refrigerator, microwave, oven, dryingmachine, closet, diningroom, aa, stove, minioven, washingmachine, others, address, description, userId, access_token);

        if(response && response.errors) {
          validate(response.errors);
          return false;
        }

        if(response && response.ok) {
          toast.error(response.msg);
          return false;
        }

        if(response && response.data) {
        
          if((images.length == 0) ) {
            const loadWithOutImages             = await updateImagesExists(response.data.properties[0]._id, remove, sort, access_token);

            if(loadWithOutImages && loadWithOutImages.errors) {
              validate(loadWithOutImages.errors);
              return false;
            }

            if(loadWithOutImages && loadWithOutImages.ok) {
              toast.error(loadWithOutImages.msg);
              return false;
            }
          }else {
            const load                          = await loadImagesProperty('update', userId, response.data.properties[0]._id, images, remove, sort, access_token);

            if(load && load.errors) {
              validate(load.errors);
              return false;
            }

            if(load && load.ok) {
                toast.error(load.msg);
                return false;
            }
          }

          toast.success(response.msg);
          return true;
        }
      }

    return false;
  }

  const validAlias                              = async (id: string, access_token: string) => {
    if(id && access_token) {
      const response                            = await validAliasInProperty(id, access_token);

      if(response && response.ok) {
        toast.error(response.msg);
        return false;
      }

      if(response && response.data) {
        return true;  
      }
    }
  }

  const removeProperty                          = async (pid: string, access_token: string) => {
    if(pid && access_token) {
      const response                            = await destroyProperty(pid, access_token);

      if(response && response.ok) {
        toast.error(response.msg);
        return false;
      }

      if(response && response.data) {
        toast.success(response.msg);
        return true;  
      }
    }
  } 

  const changeStatusProperty                    = async (pid: string, status: boolean, access_token: string) => {
    if(pid && access_token) {
      const response                            = await updatePropertyByStatus(pid, status, access_token);
    
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
        return true;
      }
    }
  }

  const showProperty                            = async (pid: string, access_token: string) => {
    if(pid && access_token) {
      const response                            = await getProperty(pid, access_token);

      if(response && response.data) {
        return response.data.properties[0];
      }

    }
  }
  
  return (
    <InmuebleContext.Provider
      value={{
        crearInmueble,
        eliminarInmueble,
        subirImagenesInmueble,
        orden,
        setOrden,
        user,
        setUser,
        solicitud,
        setSolicitud,
        actualizarInmueble,
        editar,
        setEditar,
        idInmueble,
        setIdInmueble,
        inmuebleState,
        setInmuebleState,
        dueño,
        setDueño,
        estado,
        setEstado,
        misCompUser,
        setMisCompUser,
        createProperty,
        validAlias,
        removeProperty,
        changeStatusProperty,
        showProperty,
        editProperty,
        userFavorite,
        setUserFavorite,
        userId,
        setUserId,
        status,
        setStatus
      }}
    >
      <ToastContainer />
      {children}
    </InmuebleContext.Provider>
  );
};
