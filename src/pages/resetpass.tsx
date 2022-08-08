import { useRouter } from "next/router";
import SEO from "../components/seo/SEO";
import { FormEvent, useState } from "react";
import { useForm } from "../hooks/useForm";
import styles from "../components/ui/authmodal/AuthModal.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RecuperarContraseña = () => {
    const { asPath } = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const mostrarContraseña = () => setShowPassword(!showPassword);
    const [showPassword2, setShowPassword2] = useState(false);
    const mostrarContraseña2 = () => setShowPassword2(!showPassword2);

    
    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (password !== password2) toast.error("Las contraseñas no coinciden");

      if (password.length < 6) {
        toast.error("La contraseña tiene que ser de al menos 6 caracteres");
      }
    }

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
          <div>
            <form onSubmit={onSubmit}>
              <div className="formHeader">
                <h3 className={styles.title}>Generar nueva contraseña</h3>
              </div>
              <div className={styles.formBody}>
                <div className={styles.formGroup}>
                  <label>Nueva contraseña</label>
                  <input className={styles.modalInputs2}
                  type={showPassword ? "text" : "password"} 
                  onChange={handleChange}
                  name="password"
                  value={password}
                  placeholder="Nueva contraseña" />
                  <i
                  onClick={mostrarContraseña}
                  className={`${
                    showPassword ? "bi bi-eye-slash" : "bi bi-eye"
                  } ${styles.mostrarContraseña2}`}
                />
                </div>
                <div className={styles.formGroup}>
                  <label>Confirmar contraseña</label>
                  <input 
                  onChange={handleChange}
                  type={showPassword2 ? "text" : "password"} 
                  name="password2"
                  value={password2}
                  className={styles.modalInputs2}
                  placeholder="Confirmar contraseña" />
                  <i
                  onClick={mostrarContraseña2}
                  className={`${
                    showPassword2 ? "bi bi-eye-slash" : "bi bi-eye"
                  } ${styles.mostrarContraseña2}`}
                />
                </div>
                <div className={styles.formGroup2}>
                {
                password.length > 0 && password2.length > 0 && password  === password2 ? (
                  <button type="submit" className={styles.primary}>
                    Generar nueva contraseña
                  </button>
                ) : (
                  <button type="submit" className={styles.primary2} disabled>
                    Generar nueva contraseña
                  </button>
                )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  };
  
  export default RecuperarContraseña;