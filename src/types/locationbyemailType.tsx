//Interfaces
import { Errors } from '../interfaces/AuthInterface';
import { LocationByEmail } from '../interfaces/LocationByEmailInterface';

export type locationbyemailResponse   = {
    "ok"?:                          boolean,
    "msg"?:                         string,
    "data"?:                        locationbyemail,
    "errors"?:                      Errors[]
}

export type locationbyemail          = { 
    "locationbyemails":             LocationByEmail[],
    "total"?:                       number
}

