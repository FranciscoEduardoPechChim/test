//Interfaces
import { Errors } from '../interfaces/AuthInterface';
import { Pedido } from '../interfaces/PedidosInterface';

export type orderResponse   = {
    "ok"?:                  boolean,
    "msg"?:                 string,
    "data"?:                order,
    "errors"?:              Errors[]
}

export type order           = { 
    "orders":               Pedido,
}


