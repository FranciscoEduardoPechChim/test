import { useContext, useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Container, Form } from "react-bootstrap";
import { AuthContext } from "../../../../context/auth/AuthContext";
import Button from "../../../ui/button/Button";
import styles from "./Perfil.module.css";
import Loading from "../../../ui/loading/Loading";
import Cards from '../../../ui/cards/Cards';
import { toast } from "react-toastify";

//Services
import { storeFavorite, destroyFavorite } from "../../../../services/favoriteService";
import { requestProperty } from "../../../../services/requestService";
import { storeFollower } from "../../../../services/followerService";
//Middlewares
import { hasPermission } from "../../../../middlewares/roles";
//Interfaces
import { Auth } from "interfaces/AuthInterface";
import { Inmueble } from "interfaces";
//Helpers
import { validate } from "../../../../helpers/response";
//Hooks
import { useUserProperties } from "hooks/useUserInfo";
//Context
import { InmuebleContext } from "context/inmuebles/InmuebleContext";
import { SocketContext } from "context/socket/SocketContext";
import { ChatContext } from "context/chat/ChatContext";
//Material UI
import TablePagination from '@material-ui/core/TablePagination';

interface Props {
  data?:        Auth
}

const Perfil                                    = ({data}:Props) => {
  const access_token                            = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
  const router                                  = useRouter();
  const { auth, fotoPerfil, logOut }            = useContext(AuthContext); 
  const { setUserFavorite }                     = useContext(InmuebleContext);
  const { socket }                              = useContext(SocketContext);
  const { chat }                                = useContext(ChatContext);
  const [user, setUser]                         = useState((data && (typeof data != 'undefined')) ? data:auth);
  const [offset, setOffset]                     = useState(0);
  const { loading, properties, init,
  setLimit, setProperties, total }              = useUserProperties((user && user.uid) ? user.uid:'', offset, 6, (access_token) ? access_token:'');
  const [picture, setPicture]                   = useState("");
  const [hover, setHover]                       = useState(false);
  const [cargando, setCargando]                 = useState(false);
  const [page, setPage]                         = useState(0);
  const [rowsPerPage, setRowsPerPage]           = useState(6);
  const inputFile                               = useRef<HTMLInputElement>(null);
  const misPaquetes                             = () => router.push("/perfil/mis-paquetes");
  const misPropiedades                          = () => router.push("/perfil/mis-propiedades");
  const actualizarPerfil                        = () => router.push("/perfil/actualizar-perfil");
  const referencias                             = () => router.push("/perfil/referencias-de-pago");
  const historialPagos                          = () => router.push("/perfil/historial-de-pagos");
  const abrirInputfile                          = () => inputFile.current?.click();

  const handlePicture                           = async (e: any) => {
    e.preventDefault();
    setCargando(true);
    const formData = new FormData();
    formData.append("picture", picture);

    await fotoPerfil(formData);
    setCargando(false);
  };

  const onMouseEnter                            = () => setHover(true);
  const onMouseLeave                            = () => setHover(false);

  const handleFavorite                          = async (hash: string, owner: string, isFavorite: boolean) => {
    if(auth && auth.uid && hash && owner  && (!isFavorite) && access_token) {
      const response                            = await storeFavorite(auth.uid, owner, hash, access_token);
    
      if(response && response.errors) {
        validate(response.errors);
        return false;
      }

      if(response && response.ok) {
        toast.error(response.msg);
        return false;
      }

      if(response && response.data) {
        setOffset(0);
        init();
        toast.success(response.msg);
      }
    }else if(auth && auth.uid && hash && owner  && isFavorite && access_token) {
      const response                            = await destroyFavorite(auth.uid, owner, hash, access_token);
    
      if(response && response.ok) {
        toast.error(response.msg);
        return false;
      }

      if(response && response.data) {
        setOffset(0);
        init();
        toast.success(response.msg);
      }
    }
  }

  const handleChangePage                        = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);  
    setOffset(newPage * rowsPerPage);
  }

  const handleChangeRowsPerPage                 = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLimit(parseInt(event.target.value));
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
    setOffset(0);
  }

  const handleShare                             = async (hash: string, owner: string) => {
    if(auth && auth.uid && hash && owner && access_token) {
      const response                            = await requestProperty(auth.uid, owner, hash, 'Pendiente', access_token);
       
      if(response && response.errors) {
        validate(response.errors);
        return false;
      }

      if(response && response.ok) {
        toast.error(response.msg);
        return false;
      }

      if(response && response.data) {
        socket?.emit("solicitud", response.data.requests);
        toast.success(response.msg);
      } 
    }
  }

  const handleChat                              = async (owner: string) => {
    if(auth && auth.uid && owner && access_token) {
      if(auth.uid != owner) { 
        await chat(auth.uid, owner, access_token);
      }
    }
  }

  const followUser                              = async () => {
    if(auth && auth.uid && user && user.uid && (auth.uid != user.uid) && access_token) {
      const response                            = await storeFollower(auth.uid, user.uid, access_token);

      if(response && response.errors) {
        validate(response.errors);
        return false;
      }

      if(response && response.ok) {
        toast.error(response.msg);
        return false;
      }

      if(response && response.data) {
        toast.success(response.msg);
      }
    }
  }

  useEffect(() => {
    setUserFavorite((auth && auth.uid) ? auth.uid:'');
  }, []);

  return (
    <Container>
      {cargando ? <Loading /> : null}
      <div className="d-flex justify-content-center mb-5">
        <div className="text-center">
          <div className={`${styles.imagencontainer} mt-5 mb-2`}>
            <img
              onClick={abrirInputfile}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              className={`${styles.perfilImg} pointer`}
              src={user.img}
              alt="Foto de perfil red1a1"
            />
            {hover && (!data) &&
              <div
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={abrirInputfile}
                className={`${styles.cargaImg} pointer`}
              >
                Cambiar imagen <br /> de perfil
              </div>
            }
          </div>

          { (!data) &&
            <Form
              onSubmit={handlePicture}
              encType="multipart/form-data"
              className="d-flex justify-content-center"
            >
              <Form.Group className="mb-3">
                <Form.Control
                  type="file"
                  ref={inputFile}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={(e: any) => setPicture(e.target.files[0])}
                />
              </Form.Group>
              <>{picture ? <Button titulo="Subir imagen" /> : null}</>
            </Form>
          }

          <div className={styles.nombre}>
            {user.nombre} {user.apellido}{" "}
            {(!data) && hasPermission('profile')  &&
              <i
                onClick={actualizarPerfil}
                className={`${styles.edicionIcon} bi bi-pencil-square pointer`}
              ></i>
            }
          </div>

          {user.paqueteAdquirido && (!data) &&
            <div className={styles.paquete}>
              {user.role === "Administrador" ? null : "Paquete"} {user.role}
            </div>
          }

          <div className={styles.empresa}>{(typeof user.nombreInmobiliaria != 'undefined') ? user.nombreInmobiliaria:'Sin nombre de inmobiliaria'}</div>
          <div className={styles.correo}>{(typeof user.correo != 'undefined') ? user.correo:'Sin correo electrónico'}</div>
          <div className={styles.telefono}>{(typeof user.telefonoPersonal != 'undefined') ? user.telefonoPersonal:'Sin número de teléfono'}</div>
          <div className={styles.telefono}>{(typeof user.direccionFisica != 'undefined') ? user.direccionFisica:'Sin dirección física'}</div>
          
          {(data && (typeof data != 'undefined')) && 
            <div className="row mb-1 mt-3">
              <div className="col-12 d-flex justify-content-center">
                <Button titulo="Seguir" style={{width: 200, height: 60}} btn="Secondary" onClick={() => followUser()} />
              </div>
            </div>
          }
        </div>
      </div>

      {(!data) &&
        <>
          <hr />
          <div className="row d-flex justify-content-center">
            {hasPermission('packages') &&
              <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 text-center mb-3">
                <Button titulo="Mis paquetes" style={{width: 250, height: 100}} btn="Secondary" onClick={misPaquetes} />
              </div>
            }
            {hasPermission('properties') &&
              <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 text-center mb-3">
                <Button
                  titulo="Mis propiedades"
                  btn="Secondary"
                  onClick={misPropiedades}
                  style={{width: 250, height: 100}}
                />
              </div>
            }
            {hasPermission('payments') &&
              <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 text-center mb-3">
                <Button titulo="Mis pagos" btn="Secondary" onClick={historialPagos} style={{width: 250, height: 100}} />
              </div>
            }
            {hasPermission('references') &&
              <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 text-center mb-3">
                <Button
                  titulo="Mis Referencias"
                  btn="Secondary"
                  onClick={referencias}
                  style={{width: 250, height: 100}}
                />
              </div>
            }
            <div className="col-12 text-center my-4">
              <span className={styles.btnSession} onClick={logOut}>
                <i className="bi bi-box-arrow-right" /> 
              </span>
            </div>
          </div>
        </>
      }

      {(data && (typeof data != 'undefined')) && 
      <>
        {(loading) ? <Loading />:
        <> 
          <div className="row">
            {(properties) && (properties.length != 0) && properties.map((item: any, key: number) => {
              return (
                <div key={key} className="col-sm-6 col-md-6 col-lg-4 col-xl-4 col-12 mb-5 px-4">
                  <Cards
                    property        = {item}
                    handleFavorite  = {(input:string, temporal: string, valid: boolean) => handleFavorite(input, temporal, valid)}
                    handleShare     = {(input:string, temporal: string) => handleShare(input, temporal)}
                    handleChat      = {(temporal: string) => handleChat(temporal)}
                  />
                </div>
              );
            })}
          </div>
            <TablePagination
              component             = "div"
              count                 = {total}
              page                  = {page}
              onPageChange          = {handleChangePage}
              rowsPerPage           = {rowsPerPage}
              onRowsPerPageChange   = {handleChangeRowsPerPage}
              rowsPerPageOptions    = {[6, 12, 24, 48, 96]}
              labelRowsPerPage      = {'Cantidad'}
              labelDisplayedRows    = {({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </>
          }
      </>
      }
   
    </Container>
  );
};

export default Perfil;
