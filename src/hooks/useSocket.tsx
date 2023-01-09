import { useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket      = (serverPath: string, access_token: string) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [online, setOnline] = useState<boolean | undefined>(false);

  const conectarSocket      = useCallback(() => {
    const socketTemp        = io(serverPath, {
      transports:           ['websocket'],
      autoConnect:          true,
      forceNew:             true,
      query:                { 'x-token': access_token }
    });

    setSocket(socketTemp);
  }, [serverPath]);

  const desconectarSocket   = useCallback(() => {
    if(socket) {
      socket.disconnect();
    }
  }, [socket]);

  useEffect(() => {
    if(socket) {
      setOnline(socket.connected);
    }
  }, [socket]);

  useEffect(() => {
    if(socket) {
      socket.on('connect', () => setOnline(true));
    }
  }, [socket]);

  useEffect(() => {
    if(socket) {
      socket.on('disconnect', () => setOnline(false));
    }

  }, [socket]);

  return { socket, online, conectarSocket, desconectarSocket };
};
