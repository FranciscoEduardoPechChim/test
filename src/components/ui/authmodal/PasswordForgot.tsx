import { FormEvent, useContext, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "../../../context/auth/AuthContext";
import Button from "../button/Button";
import Modaltitle from "../modaltitle/Modaltitle";
import styles from "./AuthModal.module.css";
import "react-toastify/dist/ReactToastify.css";
import { production } from "../../../credentials";
import Loading from "../loading/Loading";
import axios from "axios";
import Swal from "sweetalert2";

interface Props {
    modalShow: boolean;
    setModalShow: (show: boolean) => void;
}

const PasswordForgot = (props: Props) => {
  const { modalShow, setModalShow } = props;
  const [correo, setCorreo] = useState("");
  const { abrirPasswordForget, cerrarPasswordForget } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
		e.preventDefault();
	  setLoading(true);
		
		try {
			const url = `${production}/auth/forgot-password`;
			const obj = {
				"correo": correo
			};
			const response  = await axios.post(url, obj);
			
			Swal.fire({
				title: response.status === 200 ? '' : 'Error',
				html: response.data.msg,
				icon: response.status === 200 ? 'success' : 'error',
				allowOutsideClick: false,
				allowEscapeKey: false,
				showConfirmButton: true,
				confirmButtonColor: '#3085d6',
				confirmButtonText: 'Aceptar'
			});
			setCorreo('');
		} catch (err: any) {
			if (
				err.response &&
				err.response.status >= 400 &&
				err.response.status <= 500
			) {
				Swal.fire({
					title: 'Error',
					html: err.response.data.msg,
					icon: 'error',
					allowOutsideClick: false,
					allowEscapeKey: false,
					showConfirmButton: true,
					confirmButtonColor: '#3085d6',
					confirmButtonText: 'Aceptar'
				});
			}
		}
	
	  setLoading(false);
	};

  return (
    <div>
    {modalShow&&
    <Modal
      show={abrirPasswordForget}
      onHide={cerrarPasswordForget}
      contentClassName={styles.modalContent2}
    >
      <Modal.Header
        closeButton onClick={() => setModalShow(false)}
        style={{
          border: "none",
        }}
      />
      <ToastContainer />
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <div className="row d-flex justify-content-center">
            <Modaltitle titulo="Recuperar contraseña" />
            <span className={styles.centertext}>
                Por favor ingrese su correo electrónico para <br/>
                 recuperar su contraseña.
            </span>
            <div className="col-10">
              <label className={styles.modalLabels}>Correo electrónico</label>
              <br />
              <input
                className={`${styles.modalInputs} mb-4`}
                type="email"
                name="correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
            <div className="col-10 mb-3 text-center">
	            {loading && (
								<Loading />
	            )}
              {correo.length > 0 ? (
                <Button titulo="Enviar"/>
              ) : (
                <Button titulo="Enviar" btn="Disabled" />
              )}
            </div>
            <div className="text-center" style={{ color: "#3D87F6" }}>
              <br />
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
    }
    </div>
  );
};

export default PasswordForgot;
