import { Auth } from './AuthInterface';
import { Categoria } from './InmueblesInterface';
import { TipoPropiedad } from './PropertyType';
import { Follower } from './FollowerInterface';

export interface LocationByEmail {
    _id?:                 string;
    user:                 Auth | undefined;
    name:                 string;
    lat:                  number;
    lng:                  number;
    range:                number;
    category:             any;
    type:                 TipoPropiedad | undefined;
    rooms:                number;
    baths:                number;
    garages:              number;
    minPrice:             number;
    maxPrice:             number;
    minGround:            number;
    maxGround:            number;
    sets:                 Follower | undefined | null;
    minBuild:             number;
    maxBuild:             number;
    createdAt?:           string;
    updatedAt?:           string;
}

