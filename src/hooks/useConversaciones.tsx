import { useContext, useEffect, useState } from "react";
import { AuthContext } from "context/auth/AuthContext";
import { MensajesRespuesta, Mensaje } from "interfaces/MensajesInterface";
import { production } from "../credentials";
// import { Conversacion } from "../interfaces/ChatInterface";

export const useConversaciones = (uid: string | undefined | null) => {
  const [conversaciones, setConversaciones] = useState<any[]>([]);
  // const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [cargando, setCargando] = useState(false);

  const obtenerConversaciones = async () => {
    setCargando(true);
    const resp = await fetch(`${production}/chats/${uid}`);
    const data = await resp.json();

    setConversaciones(data);
    setCargando(false);
  };

  useEffect(() => {
    if (uid !== null && uid !== undefined) {
      obtenerConversaciones();
    }
  }, [uid]);

  return { conversaciones, cargando, setConversaciones };
};

export const useUltimoMsg = (uid: string | undefined | null, id: string | undefined | null) => {
  const { auth } = useContext(AuthContext);
  const [ultimoMsg, setUltimoMsg] = useState<Mensaje[]>([]);

  const token = localStorage.getItem("token") || "";

  const ultimoMensaje = async () => {
    const res = await fetch(`${production}/mensajes/${id}`, {
      headers: { "x-token": token },
    });

    const data: MensajesRespuesta = await res.json();
    setUltimoMsg(data.mensajes);
  };

  useEffect(() => {
    if (id !== null && id !== undefined) {
      ultimoMensaje();
    }
  }, [id]);

  return { ultimoMsg };
};
