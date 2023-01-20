import { useContext, useEffect, useState } from 'react';
import { InmuebleContext } from '../context/inmuebles/InmuebleContext';
import { production, development } from '../credentials/credentials';
import { InmueblesUsuario } from '../interfaces/CrearInmuebleInterface';
import { HistorialUsuario, PedidosUsuario } from '../interfaces/Historial';
import { Usuario, UsuariosDir } from '../interfaces/UserInterface';
import dayjs, { Dayjs } from 'dayjs';

//Services
import { showUsersByOwner, showUsers } from '../services/userService';
import { getPropertiesByUser, getPropertiesByUserWithoutToken, getPropertiesByFollowers } from '../services/propertyService';

export const useUserInfo = (uid: string | undefined | null) => {
  const [user, setUser] = useState<Usuario>();
  const [loading, setLoading] = useState(true);

  const getUserInfo = async () => {
    setLoading(true);

    const data = await fetch(`${production}/usuarios/${uid}`);
    const resp = await data.json();

    setLoading(false);
    setUser(resp);
  };

  useEffect(() => {
    getUserInfo();
  }, [uid]);

  return { user, loading };
};

export const useUserProperties                        = (id: string, offset: number, max: number, access_token: string) => {
  const [properties, setProperties]                   = useState<any>();
  const [limit, setLimit]                             = useState(max);
  const [loading, setLoading]                         = useState(true);
  const [total, setTotal]                             = useState(0);
  const { orden, user, userFavorite }                 = useContext(InmuebleContext)

  const init                                          = async () => {
    if(id && access_token && String(offset)) {
      const response                                  = await getPropertiesByUser(id, limit, offset, orden, user, userFavorite, access_token);

      if(response && response.data) {
        setProperties(response.data.properties);
        setTotal((typeof response.data.total == 'number') ? response.data.total:0);
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    init();
  }, [orden, total, id, limit, offset, user]);

  return { 
    properties:                                       properties, 
    loading:                                          loading, 
    total:                                            total, 
    setProperties:                                    setProperties, 
    setLimit:                                         setLimit,
    init:                                             init
  };
}

export const useUserWithoutTokenProperties            = (id: string, offset: number, max: number, type: string, category: string, room: number, bath: number, garage: number, minPrice: number, maxPrice: number, minGround: number, maxGround: number, minBuild: number, maxBuild: number, set: string, isToken: number) => {
  const [properties, setProperties]                   = useState<any>();
  const [limit, setLimit]                             = useState(max);
  const [loading, setLoading]                         = useState(true);
  const [total, setTotal]                             = useState(0);
  const { orden, user, userFavorite }                 = useContext(InmuebleContext)

  const init                                          = async () => {
    if(id && String(offset) && type && category && String(room) && String(bath) && String(garage) && set && String(minPrice) && String(maxPrice) && String(minGround) && String(maxGround) && String(minBuild) && String(maxBuild) && String(isToken)) {
      const response                                  = await getPropertiesByUserWithoutToken(id, limit, offset, orden, user, userFavorite, type, category, room, bath, garage, minPrice, maxPrice, minGround, maxGround, minBuild, maxBuild, set, isToken);

      if(response && response.data) {
        setProperties(response.data.properties);
        setTotal((typeof response.data.total == 'number') ? response.data.total:0);
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    init();
  }, [orden, total, id, limit, offset, user, type, category, room, bath, garage, minPrice, maxPrice, minGround, maxGround, minBuild, maxBuild, set]);

  return { 
    properties:                                       properties, 
    loadingProperties:                                loading, 
    total:                                            total, 
    setProperties:                                    setProperties, 
    setLimit:                                         setLimit,
    init:                                             init
  };
}

export const useFollowerProperties                    = (id: string, offset: number, access_token: string) => {
  const [properties, setProperties]                   = useState<any>();
  const [limit, setLimit]                             = useState(12);
  const [loading, setLoading]                         = useState(true);
  const [total, setTotal]                             = useState(0);
  const { status, userId }                            = useContext(InmuebleContext);

  const init                                          = async () => {
    if(id && access_token && String(offset) && userId) {
      const response                                  = await getPropertiesByFollowers(id, limit, offset, status, userId, access_token);
      
      if(response && response.data) {
        setProperties(response.data.properties);
        setTotal((typeof response.data.total == 'number') ? response.data.total:0);
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    init();
  }, [total, id, limit, offset, status, userId]);

  return { 
    properties:                                       properties, 
    loading:                                          loading, 
    total:                                            total, 
    setProperties:                                    setProperties, 
    setLimit:                                         setLimit,
    init:                                             init
  };
}

export const useUsers                                 = (offset: number, limit: number, startDate: Dayjs | null, endDate: Dayjs | null,  access_token:string) => {
  const [users, setUsers]                             = useState<any>([]);
  const [total, setTotal]                             = useState(0);
  const [loading, setLoading]                         = useState(true);

  const init                                          = async () => {
    if(access_token) {
      setLoading(true);
      
      const response                                  = await showUsers(offset, limit, startDate, endDate, access_token);

      if(response && response.data) {
        setUsers(response.data.users);
        setTotal((response.data.total) ? response.data.total:0);
      }

      setLoading(false);
    }
  }

  useEffect(() => {
    init();
  },[offset, limit, startDate, endDate, access_token]);

  return {
    users:          users,
    loading:        loading,
    total:          total
  }
}

export const useUserInmuebles = (uid: string | undefined | null, desde = 0) => {
  const [inmuebles, setInmuebles] = useState<InmueblesUsuario[]>();
  const [offset, setOffset]       = useState(12);
  const [cargando, setCargando] = useState(true);
  const [total, setTotal] = useState(0);
  const { orden } = useContext(InmuebleContext);

  const obtenerInmueblesDeUsuario = async () => {
    const data = await fetch(
      `${production}/inmuebles/usuario/${uid}?orden=${orden}&limite=${offset}&desde=${desde}`
    );
    const resp = await data.json();

    setInmuebles(resp.inmueblesUsuario);
    setCargando(false);
    setTotal(resp.total);
  };

  useEffect(() => {
    obtenerInmueblesDeUsuario();
  }, [orden, desde, uid, offset]);

  return { inmuebles, cargando, total, setInmuebles, setOffset };
};

export const useUltimoInmueble = (
  uid: string | undefined | null,
  desde = 0
) => {
  const [ultimoInmueble, setUltimoInmueble] = useState<InmueblesUsuario[]>();
  const [cargando, setCargando] = useState(true);
  const [total, setTotal] = useState(0);
  const { orden } = useContext(InmuebleContext);

  const obtenerInmueblesDeUsuario = async () => {
    const data = await fetch(
      `${production}/inmuebles/usuario/${uid}?limite=1&orden=-createdAt`
    );
    const resp = await data.json();
    setUltimoInmueble(resp.inmueblesUsuario);
    setCargando(false);
    setTotal(resp.total);
  };

  useEffect(() => {
    obtenerInmueblesDeUsuario();
  }, [orden, desde, uid]);

  return { ultimoInmueble, cargando, total, setUltimoInmueble };
};

export const useHistorial = (uid: string | undefined | null, desde: number) => {
  const [historial, setHistorial] = useState<HistorialUsuario[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal]         = useState(0);
  const [offset, setOffset]       = useState(10);

  const obtenerHistorial = async () => {
    const resp = await fetch(
      `${production}/historial/usuario/${uid}?desde=${desde}&limite=${offset}`
    );
    const data = await resp.json();

    setHistorial(data.historialUsuario);
    setTotal(data.total);
    setIsLoading(false);
  };

  useEffect(() => {
    obtenerHistorial();
  }, [desde, uid, offset]);

  return { historial, isLoading, setHistorial, total, setOffset };
};

export const useHistorialPagos = (
  uid: string | undefined | null,
  desde: number
) => {
  const [historialPago, setHistorialPago] = useState<PedidosUsuario[]>([]);
  const [cargando, setCargando]           = useState(true);
  const [total, setTotal]                 = useState(0);
  const [offset, setOffset]               = useState(10);

  const obtenerHistorialPagos = async () => {
    const resp = await fetch(
      `${production}/pedidos/usuarios/${uid}?desde=${desde}&limite=${offset}`
    );
    const data = await resp.json();

    setTotal(data.total);
    setHistorialPago(data.pedidosUsuario);
    setCargando(false);
  };

  useEffect(() => {
    obtenerHistorialPagos();
  }, [desde, uid, offset]);

  return { historialPago, cargando, total, setOffset };
};

export const useMyUsersById                             = (id:string, access_token: string) => {
  const [ users, setUsers ]                             = useState<any>([]);
  const [ loading, setLoading ]                         = useState(true);

  const init                                            = async () => {
    if(id && access_token) {
      const response                                    = await showUsersByOwner(id, access_token);

      if(response && response.data) {

        setUsers(response.data.users);
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    init();
  }, [id]);
  
  return {
    users:                                              users,
    loading:                                            loading,
    init:                                               init,
    setLoading:                                         setLoading
  }
}

export const useMisUsuarios                 = (uid: string | undefined | null) => {
  const [misUsuarios, setMisUsuarios]       = useState<any>([]);
  const [cargando, setCargando] = useState(true);

  const obtenerMisUsuarios = async () => {
    const res = await fetch(`${production}/usuarios/propietario/${uid}`);
    const data = await res.json();

    setMisUsuarios(data.misUsuarios);
    setCargando(false);
  };

  useEffect(() => {
    obtenerMisUsuarios();
  }, [uid]);

  return { misUsuarios, cargando, setMisUsuarios };
};

export const useUsuariosPorDir = (direccion: string | undefined) => {
  const [usuariosPorDir, setUsuariosDir] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);

  const obtenerUsuariosPorDir = async () => {
    const res = await fetch(
      `${production}/usuarios/usuario/ubicacion?direccion=${direccion}`
    );

    const data: UsuariosDir = await res.json();

    setUsuariosDir(data.usuarios);
    setCargando(false);
  };

  useEffect(() => {
    obtenerUsuariosPorDir();
  }, [direccion]);

  return { usuariosPorDir, cargando };
};
