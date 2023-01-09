import { access } from "fs/promises";
import { createContext, FC, useContext, useEffect } from "react";
import { Socket } from "socket.io-client";
import { useSocket } from "../../hooks/useSocket";
import { AuthContext } from "../auth/AuthContext";
import { ChatContext } from "../chat/ChatContext";

//Credencials
import { url } from '../../credentials/credentials';

interface ContextProps {
  socket: Socket | undefined;
  online: boolean | undefined;
}

export const SocketContext                = createContext({} as ContextProps);

export const SocketProvider: FC           = ({ children }) => {
  const access_token                      = (typeof window !== "undefined") ? localStorage.getItem('token'):"";
  const { auth }                          = useContext(AuthContext);
  const { dispatch }                      = useContext(ChatContext);
  const { socket, online, conectarSocket, 
    desconectarSocket }                   = useSocket(url, (access_token) ? access_token:'');

  useEffect(() => {
    if (auth.logged) {
      conectarSocket();
    }
  }, [auth, conectarSocket]);

  useEffect(() => {
    if (!auth.logged) {
      desconectarSocket();
    }
  }, [auth, desconectarSocket]);

  useEffect(() => {
    socket?.on("mensaje-personal", (mensaje) => {
      dispatch({ type: "NuevoMensaje", payload: mensaje });
    });
  }, [socket, dispatch]);

  return (
    <SocketContext.Provider value={{ socket, online }}>
      {children}
    </SocketContext.Provider>
  );
};
