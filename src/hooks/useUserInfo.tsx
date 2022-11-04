import { useContext, useEffect, useState } from 'react';
import { InmuebleContext } from '../context/inmuebles/InmuebleContext';
import { production, development } from '../credentials/credentials';
import { InmueblesUsuario } from '../interfaces/CrearInmuebleInterface';
import { HistorialUsuario, PedidosUsuario } from '../interfaces/Historial';
import { Usuario, UsuariosDir } from '../interfaces/UserInterface';


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

export const useMisUsuarios = (uid: string | undefined | null) => {
  // const [misUsuarios, setMisUsuarios] = useState<UsuariosPagado[]>([]);
  const [misUsuarios, setMisUsuarios] = useState<any>([]);
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
