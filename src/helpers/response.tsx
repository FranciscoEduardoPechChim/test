import { toast } from "react-toastify";

export const validate = (error: any) => {
    if(error && (error.length != 0)) {
        error.map((e:any) => {
            toast.error(e.msg);
        });
    }

    return false;
}