export const isNotEmpty         = (data: any) => {
    return (!data) ? 'El campo es requerido': '';
}

export const isString           = (data:any) => {
    return (typeof data != 'string') ? 'El campo debe ser tipo texto':'';
}

export const isNumber           = (data:any) => {
    return (typeof data != 'number') ? 'El campo debe ser tipo numérico':'';
}

export const isBoolean          = (data:any) => {
    return (typeof data != 'boolean') ? 'El campo debe ser tipo booleano':true;
}

export const  isLength          = (minLength:number, maxLength:number, data:string) => {
    return ((data.length < minLength) && (data.length > maxLength)) ? `El campo debe tener un minímo de ${minLength} y un máximo de ${maxLength}`:'';
}

export const isEmail            = (data:string) => {
    return (!(/\S+@\S+\.\S+/.test(data))) ? 'El campo debe ser de tipo correo electrónico':'';
}

export const isSamePassword     = (password: string | null | undefined, confirmPassword: string | null | undefined) => {
    return ((password != confirmPassword) || (!password) || (!confirmPassword) ) ? 'Las contraseñas deben ser las mismas':'';
}





