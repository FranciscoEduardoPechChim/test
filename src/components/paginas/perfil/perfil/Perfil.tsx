import { useContext, useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Container, Form, Modal } from "react-bootstrap";
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
import { hasPermission, isUser } from "../../../../middlewares/roles";
//Interfaces
import { Auth } from "interfaces/AuthInterface";
import { Inmueble } from "interfaces";
//Helpers
import { validate } from "../../../../helpers/response";
//Hooks
import { useUserWithoutTokenProperties } from "hooks/useUserInfo";
import { useTipoPropiedad, useCategories } from '../../../../hooks/useCategories';
import { useSets } from "hooks/useSets";
//Context
import { InmuebleContext } from "context/inmuebles/InmuebleContext";
import { SocketContext } from "context/socket/SocketContext";
import { ChatContext } from "context/chat/ChatContext";
//Material UI
import TablePagination from '@material-ui/core/TablePagination';
//Components
import Modaltitle from "../../../ui/modaltitle/Modaltitle";
//Extras
import { casasC, rentas } from "credentials";

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
  const { loading, propertyTypes, 
    obtenerTipoPropiedad }                      = useTipoPropiedad();
  const { cargando, categorias, 
    obtenerCategorias }                         = useCategories();
  const { loadingSet, sets }                    = useSets();
  const [quantity, setQuantity]                 = useState([0,1,2,3,4]);
  const [type, setType]                         = useState(casasC);
  const [category, setCategory]                 = useState(rentas);
  const [room, setRoom]                         = useState(0);
  const [bath, setBath]                         = useState(0);
  const [garage, setGarage]                     = useState(0);
  const [price, setPrice]                       = useState({min: 0, max: 10000000000});
  const [ground, setGround]                     = useState({min: 0, max: 10000});
  const [build, setBuild]                       = useState({min: 0, max: 10000});
  const [set, setSet]                           = useState('all');
  const { loadingProperties, properties, init, 
  setLimit, setProperties, total }              = useUserWithoutTokenProperties(
    (user && user.uid) ? user.uid:'', 
    offset, 
    6,
    type,
    category,
    room,
    bath,
    garage, 
    price.min,
    price.max,
    ground.min,
    ground.max,
    build.min,
    build.max,
    set,
    1
  );
  const [picture, setPicture]                   = useState("");
  const [hover, setHover]                       = useState(false);
  const [cargandos, setCargandos]                 = useState(false);
  const [page, setPage]                         = useState(0);
  const [rowsPerPage, setRowsPerPage]           = useState(6);
  const [showFilter, setShowFilter]             = useState(false);
  const inputFile                               = useRef<HTMLInputElement>(null);
  const misPaquetes                             = () => router.push("/perfil/mis-paquetes");
  const misPropiedades                          = () => router.push("/perfil/mis-propiedades");
  const actualizarPerfil                        = () => router.push("/perfil/actualizar-perfil");
  const referencias                             = () => router.push("/perfil/referencias-de-pago");
  const historialPagos                          = () => router.push("/perfil/historial-de-pagos");
  const abrirInputfile                          = () => inputFile.current?.click();

  const handlePicture                           = async (e: any) => {
    e.preventDefault();
    setCargandos(true);
    const formData = new FormData();
    formData.append("picture", picture);

    await fotoPerfil(formData);
    setCargandos(false);
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

  const handleProperty                          = async (slug: string) => {
    router.push('/propiedades/' + slug);
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

  const modalClose                              = () => {
    setShowFilter(false);
  }

  useEffect(() => {
    setUserFavorite((auth && auth.uid) ? auth.uid:'');
  }, []);

  console.log(user.img);
  return (
    <Container>
      {cargandos ? <Loading /> : null}
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

          <div className={styles.empresa}>{(typeof user.nombreInmobiliaria == 'string') ? user.nombreInmobiliaria:'Sin nombre de inmobiliaria'}</div>
          
          {access_token && (!isUser())  &&
            <>
              <div className={styles.correo}>{(typeof user.correo == 'string') ? user.correo:'Sin correo electrónico'}</div>
              <div className={styles.telefono}>{(typeof user.telefonoPersonal == 'number') ? user.telefonoPersonal:'Sin número de teléfono'}</div>
              <div className={styles.telefono}>{(typeof user.direccionFisica == 'string') ? user.direccionFisica:'Sin dirección física'}</div>
            </>
          }

          {(data && (typeof data != 'undefined') && access_token) && 
            <>
              <div className="row mt-3">
                <div className="col-12 d-flex justify-content-center">
                  <Button titulo="Seguir" style={{width: 200, height: 60}} btn="Secondary" onClick={() => followUser()} />
                </div>
              </div>
            </>
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
          <> 
              <div className="row mb-2">
                <div className="col-12 d-flex justify-content-end">
                  <Button titulo="Filtros" style={{width: 150, height: 55, marginRight: '1rem'}} btn="Filter" onClick={() => setShowFilter(!showFilter)} />
                </div>
              </div>
              {
              (loadingProperties) ? <Loading />:
                ((total == 0)) ?
                <div className="row">
                  <div className="col-12">
                    <h1 className={`${styles.titulo} text-center`}>
                      Al parecer aún no tienes ningún inmueble
                    </h1>
                  </div>
                </div>:
                <div className="row">
                  {(properties) && (properties.length != 0) && properties.map((item: any, key: number) => {
                    return (
                      <div key={key} className="col-sm-6 col-md-6 col-lg-4 col-xl-4 col-12 mb-5 px-4">
                        <Cards
                          property        = {item}
                          accessToken     = {access_token}
                          isUser          = {isUser()}
                          handleFavorite  = {(input:string, temporal: string, valid: boolean) => handleFavorite(input, temporal, valid)}
                          handleShare     = {(input:string, temporal: string) => handleShare(input, temporal)}
                          handleChat      = {(temporal: string) => handleChat(temporal)}
                          handleProperty  = {(input:string) => handleProperty(input)}
                        />
                      </div>
                    );
                  })}
                </div>
              }
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
        </>
      }

      <Modal show = {showFilter} onHide = {modalClose} contentClassName = {styles.modalS2}>
        <Modal.Header closeButton className={styles.modalS2header} />
        <Modal.Body>
          <div className="row">
            <div className="col-12">
              <div className={styles.headTitle}>
                <Modaltitle titulo={`Filtros`} />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className={`${styles.S2content} text-center mt-4 mb-1`}>
                Seleccione los filtros deseados 
              </div>
            </div>
          </div>
          <div className={styles.scrollFilter}>
            <div className="row">
              {(cargando) ? <Loading />:
                <>
                  <div className="col-12">
                    <Form.Label className={styles.S3labels} htmlFor="category">Categoría</Form.Label>
                  </div>
                  {categorias && (categorias.length != 0) && categorias.map((item:any, key: number ) => {
                    return (
                      <div key={key}  className="col-6 d-flex justify-content-center">
                        <button onClick={() => setCategory(item._id)} type="button" className={(item._id == category ? styles.bottonContainerSelect:styles.bottonContainer)}>
                          {item.nombre}
                        </button>
                      </div>
                    );
                  })}
                </>
              }
            </div>
            <div className="row my-1">
              {(loading) ? <Loading />:
                <>
                  <div className="col-12">
                    <Form.Label className={styles.S3labels} htmlFor="type">Tipo</Form.Label>
                  </div>
                  {propertyTypes && (propertyTypes.length != 0) && propertyTypes.map((item:any, key: number ) => {
                    return (
                      <div key={key} className="col-6 d-flex justify-content-center my-1">
                        <button onClick={() => setType(item._id)} type="button" className={(item._id == type ? styles.bottonContainerSelect:styles.bottonContainer)}>
                          {item.nombre}
                        </button>
                      </div>
                    );
                  })}
                </>
              }
            </div>
            <div className="row my-1">
              <div className="col-12">
                <Form.Label className={styles.S3labels} htmlFor="rooms">Recamara(s)</Form.Label>
              </div>
              <div className="col-1"></div>
              {quantity && (quantity.length != 0) && quantity.map((item:any, key: number) => {
                return (
                  <div key={key} className="col-2 d-flex justify-content-center my-1">
                    <button onClick={() => setRoom(Number(item))} type="button" className={(item == room ? styles.bottonContainerSelect:styles.bottonContainer)}>
                      {item}+
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="row my-1">
              <div className="col-12">
                <Form.Label className={styles.S3labels} htmlFor="baths">Baño(s)</Form.Label>
              </div>
              <div className="col-1"></div>
              {quantity && (quantity.length != 0) && quantity.map((item:any, key: number) => {
                return (
                  <div key={key} className="col-2 d-flex justify-content-center my-1">
                    <button onClick={() => setBath(Number(item))} type="button" className={(item == bath ? styles.bottonContainerSelect:styles.bottonContainer)}>
                      {item}+
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="row my-1">
              <div className="col-12">
                <Form.Label className={styles.S3labels} htmlFor="garages">Cochera(s)</Form.Label>
              </div>
              <div className="col-1"></div>
              {quantity && (quantity.length != 0) && quantity.map((item:any, key: number) => {
                return (
                  <div key={key} className="col-2 d-flex justify-content-center my-1">
                    <button onClick={() => setGarage(Number(garage))} type="button" className={(item == garage ? styles.bottonContainerSelect:styles.bottonContainer)}>
                      {item}+
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="row my-1">
              <div className="col-12">
                <Form.Label className={styles.S3labels} htmlFor="prices">Precio</Form.Label>
              </div>
              <div className="col-1"></div>
              <div className="col-5 d-flex justify-content-center">      
                <Form.Control type="number" autoComplete="off" defaultValue={price.min} min={0} max={price.max} name="min_prices"  placeholder="0" onChange={(e:any) => {
                  price.min   = Number(e.target.value);
                  setPrice(price);
                }} />
              </div>
              <div className="col-5 d-flex justify-content-center">
                <Form.Control type="number" autoComplete="off" defaultValue={price.max} min={price.min} max={10000000000} name="max_prices" placeholder="10000000000" onChange={(e:any) => {
                  price.max   = Number(e.target.value);
                  setPrice(price);
                }} />
              </div>
            </div>
            <div className="row my-1">
              <div className="col-12">
                <Form.Label className={styles.S3labels} htmlFor="grounds">Terreno</Form.Label>
              </div>
              <div className="col-1"></div>
              <div className="col-5 d-flex justify-content-center">      
                <Form.Control type="number" autoComplete="off" defaultValue={ground.min} min={0} max={ground.max} name="min_grounds" placeholder="0" onChange={(e:any) => {
                  ground.min   = Number(e.target.value);
                  setGround(price);
                }} />
              </div>
              <div className="col-5 d-flex justify-content-center">
                <Form.Control type="number" autoComplete="off" defaultValue={ground.max} min={ground.min} max={10000} name="max_grounds" placeholder="10000" onChange={(e:any) => {
                  ground.max   = Number(e.target.value);
                  setGround(ground);
                }} />
              </div>
            </div>
            <div className="row my-1">
              {(loadingSet) ? <Loading />:
                <>
                  <div className="col-12">
                    <Form.Label className={styles.S3labels} htmlFor="sets">Conjunto</Form.Label>
                  </div>
                  <div className="col-6 d-flex justify-content-center my-1">
                    <button onClick={() => setSet('all')} type="button" className={((set == 'all') ? styles.bottonContainerSelect:styles.bottonContainer)}>
                      Todos
                    </button>
                  </div>
                  {sets && (sets.length != 0) && sets.map((item:any, key: number ) => {
                    return (
                      <div key={key} className="col-6 d-flex justify-content-center my-1">
                        <button onClick={() => setSet(item._id)} type="button" className={(item._id == set ? styles.bottonContainerSelect:styles.bottonContainer)}>
                          {item.nombre}
                        </button>
                      </div>
                    );
                  })}
                </>
              }
            </div>
            <div className="row my-1">
              <div className="col-12">
                <Form.Label className={styles.S3labels} htmlFor="builds">Construidos</Form.Label>
              </div>
              <div className="col-1"></div>
              <div className="col-5 d-flex justify-content-center">      
                <Form.Control type="number" autoComplete="off" defaultValue={build.min} min={0} max={build.max} name="min_bluids" placeholder="0" onChange={(e:any) => {
                  build.min = Number(e.target.value);
                  setBuild(build);
                }} />
              </div>
              <div className="col-5 d-flex justify-content-center">
                <Form.Control type="number" autoComplete="off" defaultValue={build.max} min={build.min} max={10000} name="max_bluids" placeholder="10000" onChange={(e:any) => {
                  build.max = Number(e.target.value);
                  setBuild(build);
                }} />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
   
    </Container>
  );
};

export default Perfil;
