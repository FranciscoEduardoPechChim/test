import { FormEvent, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Form, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { GoogleLogin } from "react-google-login";
import { AuthContext } from "../../../context/auth/AuthContext";
import { useForm } from "../../../hooks/useForm";
import Button from "../button/Button";
import Modaltitle from "../modaltitle/Modaltitle";
import styles from "./AuthModal.module.css";
import "react-toastify/dist/ReactToastify.css";
import { googleClientId } from "credentials";
import PasswordForgot from "../authmodal/PasswordForgot";
//import { gapi } from 'gapi-script';

const LoginModal = () => {
  const router = useRouter();
  const [modalShow, setModalShow]       = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, mostrarLogin, cerrarLogin, abrirRegistro, signInWithGoogle } =
    useContext(AuthContext);
  const { formulario, handleChange, setFormulario } = useForm({
    correo: "",
    password: "",
    rememberme: false,
  });

  useEffect(() => {

    const correo = (typeof window !== "undefined") ? localStorage.getItem("correo"):"";

    if (correo) {
      setFormulario({
        ...formulario,
        correo,
        rememberme: true,
      });
    }

    
    // const initClient = () => {
    //     gapi.client.init({
    //       clientId: googleClientId,
    //       scope: ''
    //     });
    // };

    // gapi.load('client:auth2', initClient);
  }, []);

  const { correo, password, rememberme } = formulario;

  const toggleCheck = () => {
    setFormulario({ ...formulario, rememberme: !rememberme });
  };


  const onSubmit                      = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    (rememberme) ? localStorage.setItem("correo", correo): localStorage.removeItem("correo");

    const isValid                    = await login(correo, password);
    
    if(isValid) {
      router.push("/perfil");
      cerrarLogin();
    }

  };

  const mostrarContrase??a = () => setShowPassword(!showPassword);

  const handleModals = () => {
    cerrarLogin();
    abrirRegistro();
  };

  const handleModalPassword = () => {
    cerrarLogin();
    setModalShow(!modalShow)
  };

  const onSuccess = (res:any) => {
    console.log('success:', res);
  }

  const onFailure = (err:any) => {
      console.log('failed:', err);
  }
  return (
    <>
      <Modal
        show={mostrarLogin}
        onHide={cerrarLogin}
        contentClassName={styles.modalContent}
      >
        <Modal.Header
          closeButton
          style={{
            border: "none",
          }}
        />
        <ToastContainer />
        <Modal.Body>
          <Form onSubmit={onSubmit}>
            <div className="row d-flex justify-content-center">
              <Modaltitle titulo="Inicia sesi??n" />

              <div className="col-10">
                <label className={styles.modalLabels}>Correo electr??nico</label>
                <br />
                <input
                  className={`${styles.modalInputs} mb-4`}
                  type="mail"
                  name="correo"
                  value={correo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-10">
                <label className={styles.modalLabels}>Contrase??a</label>
                <br />
                <div>
                  <input
                    className={`${styles.modalInputs} mb-4`}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={handleChange}
                    required
                  />
                  <i
                    onClick={mostrarContrase??a}
                    className={`${
                      showPassword ? "bi bi-eye-slash" : "bi bi-eye"
                    } ${styles.mostrarContrase??a}`}
                  />
                </div>
              </div>       
              <div className="col-4 my-4">
                <hr />
              </div>
              <div className="col-2 text-center my-4 modal-labels">O</div>
              <div className="col-4 my-4">
                <hr />
              </div>

              {/* <GoogleLogin
                clientId            = {googleClientId}
                buttonText          = "Inicia sesi??n con google"
                onSuccess           = {signInWithGoogle}
                onFailure           = {signInWithGoogle}
                cookiePolicy        = {"single_host_origin"}
                render              = {(renderProps:any) => {
                  return(
                    <div
                      onClick         = {renderProps.onClick}
                      className       = "col-10 mb-3 text-center pointer"
                    >
                      <div className  = {styles.modalGoogleBtn}>
                        <img
                          className   = "me-3"
                          src         = "/images/icons/google-icon.png"
                          alt         = "Inicia sesi??n con google"
                        />
                        Inicia sesi??n con Google
                      </div>
                    </div>
                  );
                }}
              /> */}


            <GoogleLogin
              clientId            = {googleClientId}
              buttonText          = "Inicia sesi??n con google"
              render              = {(renderProps:any) => {
                return(
                  <div
                    onClick         = {renderProps.onClick}
                    className       = "col-10 mb-3 text-center pointer"
                  >
                    <div className  = {styles.modalGoogleBtn}>
                      <img
                        className   = "me-3"
                        src         = "/images/icons/google-icon.png"
                        alt         = "Inicia sesi??n con google"
                      />
                      Inicia sesi??n con Google
                    </div>
                  </div>
                );
              }}
              onSuccess             = {signInWithGoogle}
              onFailure             = {signInWithGoogle}
              cookiePolicy          = {'single_host_origin'}
              isSignedIn            = {true}
            />

              {/* <div className="col-10 mb-3 text-center">
                <div className={styles.modalFbBtn}>
                  <img
                    className="me-3"
                    src="/images/icons/fb-icon.png"
                    alt="Inicia sesi??n con facebook"
                  />
                  Inicia sesi??n con Facebook
                </div>
              </div> */}
              <div className="col-10 mb-3">
                <div className="form-check" onClick={() => toggleCheck()}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="rememberme"
                    checked={rememberme}
                    readOnly
                  />
                  <label className="modal-labels">Recordarme</label>
                </div>
              </div>
              <div className="col-10 mb-3 text-center">
                {correo.length > 0 && password.length > 0 ? (
                  <Button titulo="Iniciar sesi??n" />
                ) : (
                  <Button titulo="Iniciar sesi??n" btn="Disabled" />
                )}
              </div>
              <div className="text-center" style={{ color: "#3D87F6" }}>
                <span onClick={handleModals} className="pointer">
                  ??A??n no tienes cuenta? ??Reg??strate!
                </span>
                <br />
                <span onClick={handleModalPassword} className="pointer">
                  ??Has olvidado tu contrase??a? Click aqu??
                </span>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

       <PasswordForgot
          modalShow={modalShow}
          setModalShow={setModalShow}
        /> 
    </>
  );
};

export default LoginModal;
