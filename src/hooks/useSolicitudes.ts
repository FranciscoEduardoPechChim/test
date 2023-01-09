import { useEffect, useState } from "react";
import { production } from "credentials/credentials";
import { ObtenerSolicitud, Solicitud, IsProperties } from "interfaces/SolicitudInteface";

// Services
import { getRequests } from "services/requestService";
import { getIsProperties } from '../services/requestService';

export const useSolicitudes           = (uid: string | undefined | null) => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [total, setTotal]             = useState(0);
  const [cargando, setCargando]       = useState(true);

  const obtenerSolicitudes = async () => {
    if (!uid) return;

    if (uid) {
      try {
        const res = await fetch(`${production}/solicitud/${uid}`);
        const data: ObtenerSolicitud = await res.json();

        setTotal(data.total);
        setSolicitudes(data.solicitudes);
        setCargando(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    obtenerSolicitudes();
  }, [uid]);

  return { solicitudes, cargando, setSolicitudes, total };
};

export const useRequests              = (uid: string, access_token: string) => {
  const [requests, setRequests]       = useState<Solicitud[]>([]);
  const [total, setTotal]             = useState(0);
  const [loading, setLoading]         = useState(true);
  const [status, setStatus]           = useState('Pendiente');
  
  const init                          = async () => {
    if(uid && access_token) {
      const response                  = await getRequests(uid, status, access_token);

      if(response && response.data) {
        const { requests, total }     = response.data;

        setTotal((typeof total == 'number') ? total:0);
        setRequests(requests);
      }
    }

    setLoading(false);
  }

  useEffect(() => {
    init();
  }, [uid]);

  return {
    setStatus:                      setStatus,
    setRequests:                    setRequests,
    requests:                       requests,
    loading:                        loading,
    total:                          total
  }
}

export const useIsProperties            = (uid: string, access_token: string) => {
  const [isProperties, setIsProperties] = useState<IsProperties[]>([]);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(true);

  const init                            = async () => {
    if(uid && access_token) {
      const response                    = await getIsProperties(uid, access_token);

      if(response && response.data) {
        setTotal((response.data.total) ? response.data.total:0);
        setIsProperties(response.data.isproperties);
      }

      setLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, [uid]);

  return {
    isProperties:                       isProperties,
    setIsProperties:                    setIsProperties,
    totalProperties:                    total,
    setTotalProperties:                 setTotal,
    loadingProperties:                  loading
  }
}