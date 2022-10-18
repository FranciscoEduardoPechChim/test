//React
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
//Services
import { confirmForgotPassword } from '../../../services/authService';
//Components
import Home from "../../index";
//Extra
import Swal from "sweetalert2";

const ConfirmPassword           = () => {
    const router                = useRouter();
    const { id, token }         = router.query;

    const init                  = async () => {
        if(id && token) {
            const response          = await confirmForgotPassword(id, token);

            if(response) {
                Swal.fire({
                    title: (!response.ok) ? '':'Error',
                    html: response.msg,
                    icon: (!response.ok) ? 'success':'error',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });
            }
        }
    }


    useEffect(() => {
        init();
    }, [id, token]);

    return <Home />;
}


export default ConfirmPassword;