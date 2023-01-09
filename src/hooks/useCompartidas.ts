import { useContext, useEffect, useState } from "react";
import { production } from "credentials/credentials";
import {
  Compartida,
  ObtenerInmueblesCompartidosResp,
  ObtenerSolicitud,
  Solicitud,
} from "interfaces/SolicitudInteface";
import { AuthContext } from "context/auth/AuthContext";

export const useCompartidas = (
  uid: string | undefined | null,
  estado?: string,
  desde?: number
) => {
  const { auth } = useContext(AuthContext);
  const [compartidas, setCompartidas] = useState<Compartida[] | Solicitud[]>(
    []
  );
  const [cargando, setCargando]   = useState(true);
  const [total, setTotal]         = useState(0);
  const [offset, setOffset]       = useState(12);

  const obtenerCopartidas = async () => {
    if (uid === auth.uid) {
      try {
        const res = await fetch(
          `${production}/solicitud/usuario/${uid}?estado=${estado}&desde=${desde}&limite=${offset}`
        );
        const data: ObtenerInmueblesCompartidosResp = await res.json();

        setTotal(data.total);
        setCompartidas(data.compartidas);
        setCargando(false);
      } catch (error) {
        console.log(error);
      }
    }

    if (uid === "") {
      try {
        const res = await fetch(
          `${production}/solicitud/${auth.uid}?estado=${estado}&desde=${desde}&limite=${offset}`
        );
        const data: ObtenerSolicitud = await res.json();

        setTotal(data.total);
        setCompartidas(data.solicitudes);
        setCargando(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    obtenerCopartidas();
  }, [estado, desde, uid, offset]);

  return { compartidas, cargando, total, setCompartidas, setOffset, setTotal };
};
