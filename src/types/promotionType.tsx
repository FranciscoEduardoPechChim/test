//Interfaces
import { Errors } from '../interfaces/AuthInterface';
import { Promotion } from '../interfaces/PromotionInterface';

export type promotionResponse   = {
    "ok"?:                  boolean,
    "msg"?:                 string,
    "data"?:                promotion,
    "errors"?:              Errors[]
}

export type promotion           = { 
    "promotions":           Promotion,
    "total"?:               number
}


