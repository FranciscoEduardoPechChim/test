import { Auth } from '../interfaces/AuthInterface';

export interface Follower {
    _id?:                 string;
    user:                 Auth | undefined;
    owner:                Auth | undefined;
    notification:         boolean;
    email:                boolean;
    createdAt?:           string;
    updatedAt?:           string;
}
