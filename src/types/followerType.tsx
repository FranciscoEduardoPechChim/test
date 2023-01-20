//Interfaces
import { Errors } from '../interfaces/AuthInterface';
import { Follower} from '../interfaces/FollowerInterface';

export type followerResponse   = {
    "ok"?:                  boolean,
    "msg"?:                 string,
    "data"?:                follower,
    "errors"?:              Errors[]
}

export type follower          = { 
    "followers":            Follower[],
    "followme"?:            Follower[], 
    "total"?:               number
}

