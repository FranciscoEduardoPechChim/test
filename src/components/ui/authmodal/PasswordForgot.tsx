import { FormEvent, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Form, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../../../context/auth/AuthContext";
import { useForm } from "../../../hooks/useForm";
import Button from "../button/Button";
import Modaltitle from "../modaltitle/Modaltitle";
import styles from "./AuthModal.module.css";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Swal from "sweetalert2";
import { development } from "credentials";

interface Props {
    modalShow: boolean;
    setModalShow: (show: boolean) => void;
}

const PasswordForgot = (props: Props) => {
  const { modalShow, setModalShow } = props;
  const [correo, setCorreo] = useState("");
	const [msg, setMsg] = useState("");
	const [error, setError] = useState("");
  const router = useRouter();
  const { abrirPasswordForget, cerrarPasswordForget } =
    useContext(AuthContext);

  const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			const url = `${development}/auth/recuperarPassword`;
			const { data } = await axios.post(url, { correo });
			setMsg(data.message);
			setError("");
		} catch (err: any) {
			if (
				err.response &&
				err.response.status >= 400 &&
				err.response.status <= 500
			) {
				setError(err.response.data.message);
				setMsg("");
			}
		}
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
            {error && {error}}
				    {msg && {msg}}
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
