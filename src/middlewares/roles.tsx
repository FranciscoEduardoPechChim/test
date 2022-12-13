export const validRole                      = (name: string) => {
    const role                              = (typeof window !== "undefined") ? localStorage.getItem("role"):"";

    return (role && (role == name)) ? true:false;
}

export const isRoot                         = () => {
    const email                             = (typeof window !== "undefined") ? localStorage.getItem("email"):"";

    return (email && (email == 'francisco@i360.com.mx' || email == 'Eduardoest@internet360.com.mx' || email == 'Eduardoest@i360.com.mx' || email == 'franciscopech1996@example.com' || email == 'jorge.katz1619@gmail.com')) ? true:false;
}

export const isSuperAdmin                   = () => {
    return (isRoot() || validRole('SuperAdministrador')) ? true:false;
}

export const isAdmin                        = () => {
    return (validRole('Administrador')) ? true:false;
}

export const isUser                         = () => {
    return (validRole('Usuario')) ? true:false;
}

export const isIndividual                   = () => {
    return (validRole('Individual')) ? true:false;
}

export const isBasic                        = () => {
    return (validRole('Básico')) ? true:false;
}

export const isIntermediate                 = () => {
    return (validRole('Intermedio')) ? true:false;
}

export const isAdvanced                     = () => {
    return (validRole('Avanzado')) ? true:false;
}

export const isUserByPay                    = () => {
    return (validRole('UsuarioPagado')) ? true:false;
}

export const hasPermission                  = (name: string) => {   
    const permission                        = (typeof window !== "undefined") ? localStorage.getItem("permissions"):"";
    const permissions                       = (permission) ? permission.split(','):[];

    if(isSuperAdmin() || isAdmin()) {
      return true;
    }

    return permissions.includes(name);
}
