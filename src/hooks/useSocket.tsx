import { useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (serverPath: string) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [online, setOnline] = useState<boolean | undefined>(false);

  const conectarSocket = useCallback(() => {
    const token = (typeof window !== "undefined") ? localStorage.getItem('token'):"";

    const socketTemp = io(serverPath, {
      transports: ['websocket'],
      autoConnect: true,
      forceNew: true,
      query: { 'x-token': token },
    });

    setSocket(socketTemp);
  }, [serverPath]);

  const desconectarSocket = useCallback(() => {
    socket?.disconnect();
  }, [socket]);

  useEffect(() => {
    setOnline(socket?.connected);
  }, [socket]);

  useEffect(() => {
    socket?.on('connect', () => setOnline(true));
  }, [socket]);

  useEffect(() => {
    socket?.on('disconnect', () => setOnline(false));
  }, [socket]);

  return { socket, online, conectarSocket, desconectarSocket };
};
