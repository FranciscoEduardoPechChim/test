import { Dayjs } from 'dayjs';
import 'dayjs/locale/es';

export const isNotEmpty         = (data:any) => {
    return (!(typeof data != 'undefined' && data != '' && data != null)) ? 'El campo es requerido': '';
}

export const compareDate        = (startDate:Dayjs | null, endDate: Dayjs | null, isValidNull: boolean) => {

    if(!startDate && !isValidNull) {
        return 'No existe la fecha inicial';
    }

    if(!endDate && !isValidNull) {
        return 'No existe la fecha final';
    }

    return (startDate && endDate && (startDate.isSame(endDate) || startDate.isAfter(endDate))) ? 'Las fechas son invalidas':'';
}

export const isString           = (data:any) => {
    return (typeof data != 'string') ? 'El campo debe ser tipo texto':'';
}

export const isNumber           = (data:any) => {
    return (typeof data != 'number') ? 'El campo debe ser tipo numérico':'';
}

export const isInteger          = (data:any) => {
    return ((typeof data != 'number') && Number.isInteger(data)) ? 'El campo debe ser tipo entero':'';
}

export const isMin              = (data:number, min: number) => {
    return (data < min) ? 'El campo debe tener un minímo de ' + min:'';
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





