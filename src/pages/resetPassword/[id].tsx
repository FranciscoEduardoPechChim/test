import {FormEvent, useEffect, useState} from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useForm } from "../../hooks/useForm";
import SEO from "../../components/seo/SEO";
import styles from "../../components/ui/authmodal/AuthModal.module.css";
import "react-toastify/dist/ReactToastify.css";
import {production} from "../../credentials";
import axios from "axios";
import Swal from "sweetalert2";

const resetPassword = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { asPath, query } = useRouter();
  const { id, email } = query;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showForm, setShowForm] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showPassword, setShowPassword] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showPassword2, setShowPassword2] = useState(false);
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (id === undefined && email === undefined) {
      setShowForm(false);
    } else {
      handleVerification();
    }
  }, [id, email]);
  
  const handleVerification = async () => {
    try {
      const url = `${production}/auth/token-verification`;
      const obj = {
        "correo": email,
        "token": id
      };
      const { data } = await axios.post(url, obj);
      setShowForm(data.ok);
    } catch (err: any) {
      setShowForm(false);
    }
  };
  
  const mostrarContrasena = () => setShowPassword(!showPassword);
  
  const mostrarContrasena2 = () => setShowPassword2(!showPassword2);
  
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error("Las contraseñas no coinciden");
      return false;
    }

    if (password.length < 6) {
      toast.error("La contraseña tiene que ser de al menos 6 caracteres");
      return false;
    }
    
    if (password2.length < 6) {
      toast.error("La contraseña tiene que ser de al menos 6 caracteres");
      return false;
    }
  
    try {
      const url = `${production}/auth/password-reset`;
      const obj = {
        "correo": email,
        "token": id,
        "password": password,
        "password2": password2
      };
      const { data } = await axios.post(url, obj);
      Swal.fire({
        title: data.ok ? '' : 'Error',
        html: data.msg,
        icon: data.ok ? 'success' : 'error',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      })
    } catch (err: any) {
    }
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { formulario, handleChange } = useForm({
    password: "",
    password2: "",
  });

  const { password, password2 } = formulario;
  
  return (
    <>
      <SEO titulo="Recuperar contraseña" url={asPath} />
      <div className={styles.container}>
        <h1>Recuperar contraseña</h1>
        {!showForm && (
          <div className="row d-flex justify-content-center mt-4 mb-4">
            <div className="col-11 col-sm-9 col-md-7">
              <div className="alert alert-danger">
                Este link ha sido expirado por favor realice nuevamente la operación en la solicitud del cambio de contraseña
              </div>
            </div>
          </div>
        )}
        {showForm && (
          <form onSubmit={onSubmit}>
            <div className="row d-flex justify-content-center mt-4 mb-4">
              <div className="col-11 col-sm-9 col-md-7">
                <label className={styles.modalLabels}>Nueva Contraseña</label>
                <br />
                <div>
                  <input
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    className={styles.modalInputs}
                  />
                  <i
                    onClick={mostrarContrasena}
                    className={`${
                      showPassword ? "bi bi-eye-slash" : "bi bi-eye"
                    } ${styles.mostrarContrasena2}`}
                  />
                </div>
              </div>
              <div className="col-11 col-sm-9 col-md-7 mt-4">
                <label className={styles.modalLabels}>Confirmar Contraseña</label>
                <br />
                <div>
                  <input
                    onChange={handleChange}
                    type={showPassword2 ? "text" : "password"}
                    name="password2"
                    value={password2}
                    className={styles.modalInputs2}
                  />
                  <i
                    onClick={mostrarContrasena2}
                    className={`${
                      showPassword2 ? "bi bi-eye-slash" : "bi bi-eye"
                    } ${styles.mostrarContrasena2}`}
                  />
                </div>
              </div>
              <div className="col-11 col-sm-9 col-md-7 mt-4 text-center">
                <button
                  type="submit"
                  className={(password.length > 0 && password2.length > 0 && password === password2) ? styles.primary : styles.primary2}
                  disabled={(password.length > 0 && password2.length > 0 && password === password2) ? false : true}
                >
                  Generar nueva contraseña
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default resetPassword;
