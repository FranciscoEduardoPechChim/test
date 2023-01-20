import {
  createContext,
  Dispatch,
  FC,
  MutableRefObject,
  SetStateAction,
  useContext,
  useReducer,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { AuthContext } from "context/auth/AuthContext";
import { useConversaciones } from "hooks/useConversaciones";
import { Conversacion } from "interfaces/ChatInterface";
import { crearChat, obtenerMensajes } from "../../helpers/fetch";
import { ActionType, chatReducer } from "./chatReducer";

//Services
import { storeChat } from '../../services/chatService';
//Helpers
import { validate } from '../../helpers/response';

export interface CrearChat {
  remitente: string | null | undefined;
  destinatario: string;
}

interface ContextProps {
  minimizarChat: boolean;
  setMinimizarChat: Dispatch<SetStateAction<boolean>>;
  chatState: { uid: string; chatActivo: null; mensajes: never[] };
  dispatch: Dispatch<ActionType>;
  mensajePara: string;
  setMensajePara: any;
  scrollToBotom: MutableRefObject<HTMLDivElement | null>;
  iniciarChat: (data: CrearChat) => Promise<void>;
  chat: (from: string, to: string, access_token: string) => Promise<boolean>;
  conversaciones: Conversacion[];
  cargando: boolean;
  showCanvas: boolean;
  setShowCanvas: Dispatch<SetStateAction<boolean>>;
  handleCloseCanvas: () => void;
  handleShowCanvas: () => void;
}

export const initialState: any = {
  uid: "",
  chatActivo: null,
  mensajes: [],
};

export const ChatContext = createContext({} as ContextProps);

export const ChatProvider: FC               = ({ children }) => {
  const { auth }                            = useContext(AuthContext);
  const [chatState, dispatch]               = useReducer(
    chatReducer,
    initialState,
    undefined
  );
  const [mensajePara, setMensajePara]       = useState("");
  const [minimizarChat, setMinimizarChat]   = useState(true);
  const scrollToBotom                       = useRef<HTMLDivElement | null>(null);
  const [showCanvas, setShowCanvas]         = useState(false);
  const { conversaciones, cargando, 
    setConversaciones, setTotal }           = useConversaciones(auth.uid); 

  const iniciarChat                         = async (data: CrearChat) => {
    if (data.destinatario === data.remitente) return;

    const añadirChat = await crearChat("chats", data);
    dispatch({ type: "ActivarChat", payload: data.destinatario });

    const resp = await obtenerMensajes(`mensajes/${data.destinatario}`);
    dispatch({ type: "CargarMensajes", payload: resp.mensajes });

    if (añadirChat.ok) {
      setConversaciones([...conversaciones, añadirChat.guardarChat]);
    }

    scrollToBotom.current?.scrollIntoView();
  };

  const chat                                = async (from: string, to: string, access_token: string) => {
    if(from && to && access_token) {
      const response                        = await storeChat(from, to, access_token);

      if(response && response.errors) {
        validate(response.errors);
        return false;
      }

      if(response && response.ok) {
        toast.error(response.msg);
        return false;
      }

      if(response && response.data) {
        dispatch({ type: "ActivarChat", payload: to });
        dispatch({ type: "CargarMensajes", payload: response.data.messages });
        setTotal(response.data.total);
        setConversaciones([...conversaciones, response.data.chat]);
        scrollToBotom.current?.scrollIntoView();

        return true;
      }
    }

    return false;
  }

  const handleCloseCanvas = () => setShowCanvas(false);
  const handleShowCanvas = () => setShowCanvas(true);

  return (
    <ChatContext.Provider
      value={{
        minimizarChat,
        setMinimizarChat,
        chatState,
        dispatch,
        mensajePara,
        setMensajePara,
        scrollToBotom,
        iniciarChat,
        cargando,
        conversaciones,
        showCanvas,
        setShowCanvas,
        handleCloseCanvas,
        handleShowCanvas,
        chat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
