import { useContext, useEffect, useState } from 'react';
import { InmuebleContext } from '../context/inmuebles/InmuebleContext';
import { production, development } from '../credentials/credentials';
import { InmueblesUsuario } from '../interfaces/CrearInmuebleInterface';
import { HistorialUsuario, PedidosUsuario } from '../interfaces/Historial';
import { Usuario, UsuariosDir } from '../interfaces/UserInterface';

//Services
import { showUsersByOwner } from '../services/userService';
import { getPropertiesByUser, getPropertiesByFollowers } from '../services/propertyService';

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
