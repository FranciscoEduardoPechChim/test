//Interfaces
import { Errors } from '../interfaces/AuthInterface';
import { Pedido, Subcription } from '../interfaces/PedidosInterface';

export type orderResponse           = {
    "ok"?:                          boolean,
    "msg"?:                         string,
    "data"?:                        order,
    "errors"?:                      Errors[]
}

export type subscriptionResponse    = {
    "ok"?:                          boolean,
    "msg"?:                         string,
    "data"?:                        subscription,
}

export type subscription            = {
    "subscriptions":                Subcription
}

export type order                   = { 
    "orders":                       Pedido,
}


