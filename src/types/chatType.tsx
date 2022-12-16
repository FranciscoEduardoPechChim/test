//Interfaces
import { Errors } from '../interfaces/AuthInterface';
import { GuardarChat } from '../interfaces/ChatInterface';
import { Mensaje } from '../interfaces/MensajesInterface';

export type chatResponse   = {
    "ok"?:                  boolean,
    "msg"?:                 string,
    "data"?:                chat,
    "errors"?:              Errors[]
}

export type chat            = { 
    "chat":                GuardarChat,
    "messages":            Mensaje[],
    "total":               number
}



