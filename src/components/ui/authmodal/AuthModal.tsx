import { FormEvent, useContext, useState } from "react";
import { useRouter } from "next/router";
import { Form, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "../../../hooks/useForm";
import Button from "../button/Button";
import Modaltitle from "../modaltitle/Modaltitle";
import styles from "./AuthModal.module.css";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../../context/auth/AuthContext";
import GoogleLogin from "react-google-login";
import { production, googleClientId } from "credentials/credentials";

//Validations
import { isNotEmpty, isString, isLength, isEmail, isSamePassword } from '../../../helpers/validations';

const RegisterModal                       = () => {
  const router                            = useRouter();
  const [showPassword, setShowPassword]   = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const {
    register,
    mostrarRegistro,
    cerrarRegistro,
    abrirLogin,
    signInWithGoogle,
  } = useContext(AuthContext);

  const INITIAL_STATE                                               = {
    name:                           '',
    lastName:                       '',
    email:                          '',
    password:                       '',
    confirmPassword:                '',
    role:                           'Usuario'
  }

  const [errorName, setErrorName]                                   = useState([]);
  const [errorLastName, setErrorLastName]                           = useState([]);
  const [errorEmail, setErrorEmail]                                 = useState([]);
  const [errorPassword, setErrorPassword]                           = useState([]);
  const [errorConfirmPassword, setErrorConfirmPassword]             = useState([]);

  const formValidate                                                = (name: string, message: any) => {

    const messageError                                              = message.filter((value:any) => value != '');

    if(messageError.length == 0) {
      return false;
    }

    switch(name) {
      case 'name':
        setErrorName(messageError);
      return true;
      case 'lastName':
        setErrorLastName(messageError);
      return true;
      case 'email':
        setErrorEmail(messageError);
      return true;
      case 'password':
        setErrorPassword(messageError);
      return true;
      case 'confirmPassword':
        setErrorConfirmPassword(messageError);
      return true;
      default:
      return true;
    }

 
  }

  const { formulario, handleChange }                                = useForm(INITIAL_STATE);
  const { name, lastName, email, password, confirmPassword, role }  = formulario;


  const onSubmit                                                    = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorName([]); setErrorLastName([]); setErrorEmail([]); setErrorPassword([]); setErrorConfirmPassword([]);

    const formName                                                  = formValidate('name', [isNotEmpty(name), isString(name)]);
    const formLastName                                              = formValidate('lastName', [isNotEmpty(lastName), isString(lastName)]);
    const formEmail                                                 = formValidate('email', [isNotEmpty(email), isEmail(email)]);
    const formPassword                                              = formValidate('password', [isNotEmpty(password), isLength(4,20, password), isString(password), isSamePassword(password, confirmPassword)]);
    const formConfirmPassword                                       = formValidate('confirmPassword', [isNotEmpty(confirmPassword), isLength(4,20, confirmPassword) ,isString(confirmPassword), isSamePassword(confirmPassword, password)]);

    if(formName || formLastName || formEmail || formPassword || formConfirmPassword) {
      return false;
    }

    const isValid                                                   = await register(name, lastName, email, password, confirmPassword);

    if (isValid) {
        cerrarRegistro();
        router.push("/perfil/actualizar-perfil");
    }
  };

  const handleModals = () => {
    cerrarRegistro();
    abrirLogin();
  };

  const mostrarContraseña = () => setShowPassword(!showPassword);

  const mostrarContraseña2 = () => setShowPassword2(!showPassword2);

  return (
    <>
      <Modal
        show={mostrarRegistro}
        onHide={cerrarRegistro}
        contentClassName={styles.modalContent}
      >
        <Modal.Header
          closeButton
          style={{
            border: "none",
          }}
        />
        <ToastContainer autoClose={10000} />

        <Modal.Body>
          <Form onSubmit={onSubmit}>
            <div className="row d-flex justify-content-center">
              <Modaltitle titulo="Registrarse" />

              <div className="col-10 my-1">
                <label className    = {styles.modalLabels}>Nombre</label>
                <br />
                <input
                  className         = {`${styles.modalInputs} mb-4`}
                  type              = "text"
                  name              = "name"
                  value             = {name}
                  onChange          = {handleChange}
                />
                {(errorName) && (errorName.length != 0) && 
                  errorName.map((value:any, key: any) => { return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>); })          
                }
              </div>
              <div className="col-10 my-1">
                <label className    = {styles.modalLabels}>Apellidos</label>
                <br />
                <input
                  className         = {`${styles.modalInputs} mb-4`}
                  type              = "text"
                  name              = "lastName"
                  value             = {lastName}
                  onChange          = {handleChange}
                />
                {(errorLastName) && (errorLastName.length != 0) && 
                  errorLastName.map((value:any, key: any) => { return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>); })         
                }
              </div>
              <div className="col-10 my-1">
                <label className    = {styles.modalLabels}>Correo electrónico</label>
                <br />
                <input
                  className         = {`${styles.modalInputs} mb-4`}
                  type              = "email"
                  name              = "email"
                  value             = {email}
                  onChange          = {handleChange}
                />
                {(errorEmail) && (errorEmail.length != 0) && 
                  errorEmail.map((value:any, key: any) => { return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>); })         
                }
              </div>
              <div className="col-10 my-1">
                <label className    = {styles.modalLabels}>Contraseña</label>
                <br />
                <div>
                  <input
                    className       = {`${styles.modalInputs} mb-4`}
                    type            = {showPassword ? "text" : "password"}
                    name            = "password"
                    value           = {password}
                    onChange        = {handleChange}
                  />
                  <i
                    onClick         = {mostrarContraseña}
                    className       = {`${
                      showPassword ? "bi bi-eye-slash" : "bi bi-eye"
                    } ${styles.mostrarContraseña}`}
                  />
                  {(errorPassword) && (errorPassword.length != 0) && 
                    errorPassword.map((value:any, key: any) => { return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>); })           
                  }
                </div>
              </div>
              <div className="col-10 my-1">
                <label className  = {styles.modalLabels}>
                  Confirme su contraseña
                </label>
                <br />
                <div>
                  <input
                    className     = {`${styles.modalInputs} mb-4`}
                    type          = {showPassword2 ? "text" : "password"}
                    name          = "confirmPassword"
                    value         = {confirmPassword}
                    onChange      = {handleChange}
                  />
                  <i
                    onClick={mostrarContraseña2}
                    className     = {`${
                      showPassword2 ? "bi bi-eye-slash" : "bi bi-eye"
                    } ${styles.mostrarContraseña}`}
                  />
                  {(errorConfirmPassword) && (errorConfirmPassword.length != 0) && 
                    errorConfirmPassword.map((value:any, key: any) => { return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>); })            
                  }
                </div>
              </div>
              <div className="col-10 mb-3 text-center my-1">
                {((name.length > 0) && (lastName.length > 0) && (email.length > 0) && (password.length > 0) && (confirmPassword.length > 0)) ?
                  <Button titulo="Registrarse"/>:
                  <Button titulo="Registrarse" btn="Disabled" />
                }
              </div>
              <div className="col-4 my-4">
                <hr />
              </div>
              <div className="col-2 text-center my-4 modal-labels">O</div>
              <div className="col-4 my-4">
                <hr />
              </div>
              <GoogleLogin
                clientId      = {googleClientId}
                buttonText    = "Inicia sesión con google"
                onSuccess     = {signInWithGoogle}
                onFailure     = {signInWithGoogle}
                cookiePolicy  = {"single_host_origin"}
                render        = {(renderProps) => (
                  <div
                    onClick={renderProps.onClick}
                    className="col-10 mb-3 text-center pointer"
                  >
                    <div className={styles.modalGoogleBtn}>
                      <img
                        className="me-3"
                        src="/images/icons/google-icon.png"
                        alt="Inicia sesión con google"
                      />
                      Regístrate con Google
                    </div>
                  </div>
                )}
              />

              <div className="text-center">
                <span
                  onClick     = {handleModals}
                  className   = "pointer"
                  style       = {{ color: "#3D87F6" }}
                >
                  ¿Ya tienes cuenta? ¡Inicia sesión!
                </span>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RegisterModal;
