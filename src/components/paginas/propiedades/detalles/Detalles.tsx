import { useContext, useState, useEffect } from "react";
import { Accordion, Form } from "react-bootstrap";
import { useRouter } from "next/router";
import { AuthContext } from "../../../../context/auth/AuthContext";
import { formatPrice } from "../../../../helpers/formatPrice";
import { publicadoHace } from "../../../../helpers/horaMes";
import { InmueblesUsuario } from "../../../../interfaces/CrearInmuebleInterface";
import styles from "./Inmueble.module.css";

//React
import { toast } from "react-toastify";
//Services
import { updatePropertyByAlias } from '../../../../services/propertyService';
//Helpers
import { validate } from '../../../../helpers/response';
//Middlewares
import { isUser, isBasic } from "middlewares/roles";

interface Props {
  inmuebles: InmueblesUsuario;
}

const Detalles                          = ({ inmuebles }: Props) => {
  const access_token                    = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
  const { auth, validRole }             = useContext(AuthContext);
  const [isRole, setIsRole]             = useState(false);
  const [alias, setAlias]               = useState('');   
  const [result, setResult]             = useState('');
  const router                          = useRouter();

  useEffect(() => {
    const initRole                      = async () => {
      const role                        = await validRole();
      setIsRole((role) ? role:false);
    }

    initRole();
  }, [validRole]);

  const onSubmit                       = async () => {
    if(inmuebles && alias && access_token) {
      const response                   = await updatePropertyByAlias(inmuebles._id, alias, access_token);
      
      if(response && response.errors) {
        setResult('');
        validate(response.errors);
        return false;
      }

      if(response && response.ok) {
        setResult('');
        toast.error(response.msg);
        return false;
      }

      if(response && response.data) {
        setResult(alias);
      }

    }
  }

  const handleOwner                    = (owner:string) => {
    if(owner) {
      router.push(`/perfil/${owner}`);
    }
  }

  return (
    <section className="mb-4">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-9">
            <div className="row d-flex justify-content-between">
              <div className="col-12 text-sm-center text-md-start text-lg-start text-center">
                <div className={`${styles.inmuebleTitle} mb-3`}>
                  {inmuebles.titulo}
                </div>
              </div>
              <div className="col-sm-12 col-md-5 col-lg-5 text-sm-center text-md-start text-lg-start text-center">
                <div className={styles.inmueblePrecio}>
                  {formatPrice(inmuebles.precio)}
                </div>
              </div>
              <div className="col-sm-12 col-md-3 col-lg-3 text-sm-center text-md-start text-lg-start text-center">
                <div className="mt-3">
                  <span className={`${styles.inmuebleTipo} m-1`}>
                    {inmuebles.categoria.nombre}
                  </span>
                  {/* <div className={styles.divisor}></div> */}
                  <span className={`${styles.inmuebleTipo2} m-1`}>
                    {inmuebles.tipoPropiedad.nombre}
                  </span>
                </div>
              </div>
              <div className="col-sm-12 col-md-4 col-lg-4 text-sm-center text-md-end text-lg-end text-center">
                <div className={`${styles.inmuebleTiempo} mt-3`}>
                  Publicado {publicadoHace(inmuebles.createdAt)}
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-12">
                <div className={styles.inmuebleSubtitle}>
                  Detalles del inmueble
                </div>
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 col-6">
                <div className="inmueble-contenido">
                  <table>
                    <tbody>
                      <tr>
                        <td valign="top">
                          <img
                            className="me-3"
                            src="/images/icons/deatails-icons/1.png"
                            alt="..."
                          />
                        </td>
                        <td>
                          <div className={styles.inmuebleContent}>
                            ID del inmueble
                          </div>
                          <div
                            className={`${styles.inmuebleSubcontent} mb-1`}
                            style={{ fontSize: "24px" }}
                          >
                            {(inmuebles.alias || result)
                              ? ((inmuebles.alias) ? inmuebles.alias:(result) ? result:'')
                              : 
                              (isRole && (auth && (auth.uid == inmuebles.usuario.uid))) ? 
                              <Form>
                                <Form.Control defaultValue={alias} id="alias" type="text" name="alias" maxLength={255} placeholder="House one" onChange={(event:any) => setAlias(event.target.value) } onBlur={() => onSubmit()} />
                              </Form>
                              :'S/N'
                              }
                            <br />
                            <br />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 col-6">
                <div className="inmueble-contenido">
                  <table>
                    <tbody>
                      <tr>
                        <td valign="top">
                          <img
                            className="me-3"
                            src="/images/icons/deatails-icons/2.png"
                            alt="..."
                          />
                        </td>
                        <td>
                          <div className={styles.inmuebleContent}>
                            M² de construcción
                          </div>
                          <div className={`${styles.inmuebleSubcontent} mb-1`}>
                            {inmuebles.m2Construidos
                              ? inmuebles.m2Construidos
                              : "S/N"}
                            <br />
                            <br />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 col-6">
                <div className="inmueble-contenido">
                  <table>
                    <tbody>
                      <tr>
                        <td valign="top">
                          <img
                            className="me-3"
                            src="/images/icons/deatails-icons/2.png"
                            alt="..."
                          />
                        </td>
                        <td>
                          <div className={styles.inmuebleContent}>
                            M² de terreno
                          </div>
                          <div className={`${styles.inmuebleSubcontent} mb-1`}>
                            {inmuebles.m2Terreno
                              ? inmuebles.m2Terreno
                              : "S/N"}
                            <br />
                            <br />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 col-6">
                <div className="inmueble-contenido">
                  <table>
                    <tbody>
                      <tr>
                        <td valign="top">
                          <img
                            className="me-3"
                            src="/images/icons/deatails-icons/3.png"
                            alt="..."
                          />
                        </td>
                        <td>
                          <div className={styles.inmuebleContent}>
                            Habitaciones
                          </div>
                          <div className={`${styles.inmuebleSubcontent} mb-1`}>
                            {inmuebles.habitaciones
                              ? inmuebles.habitaciones
                              : "S/N"}
                            <br />
                            <br />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 col-6">
                <div className="inmueble-contenido">
                  <table>
                    <tbody>
                      <tr>
                        <td valign="top">
                          <img
                            className="me-3"
                            src="/images/icons/deatails-icons/4.png"
                            alt="..."
                          />
                        </td>
                        <td>
                          <div className={styles.inmuebleContent}>
                            Baños completos
                          </div>
                          <div className={`${styles.inmuebleSubcontent} mb-1`}>
                            {inmuebles.baños
                              ? inmuebles.baños
                              : "S/N"}
                            <br />
                            <br />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 col-6">
                <div className="inmueble-contenido">
                  <table>
                    <tbody>
                      <tr>
                        <td valign="top">
                          <img
                            className="me-3"
                            src="/images/icons/deatails-icons/5.png"
                            alt="..."
                          />
                        </td>
                        <td>
                          <div className={styles.inmuebleContent}>
                            Medios baños
                          </div>
                          <div className={`${styles.inmuebleSubcontent} mb-1`}>
                            {inmuebles.medioBaños
                              ? inmuebles.medioBaños
                              : "S/N"}
                            <br />
                            <br />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 col-6">
                <div className="inmueble-contenido">
                  <table>
                    <tbody>
                      <tr>
                        <td valign="top">
                          <img
                            className="me-3"
                            src="/images/icons/deatails-icons/6.png"
                            alt="..."
                          />
                        </td>
                        <td>
                          <div className={styles.inmuebleContent}>
                            Estacionamientos
                          </div>
                          <div className={`${styles.inmuebleSubcontent} mb-1`}>
                            {inmuebles.parking
                              ? inmuebles.parking
                              : "S/N"}
                            <br />
                            <br />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 col-6">
                <div className="inmueble-contenido">
                  <table>
                    <tbody>
                      <tr>
                        <td valign="top">
                          <img
                            className="me-3"
                            src="/images/icons/deatails-icons/7.png"
                            alt="..."
                          />
                        </td>
                        <td>
                          <div className={styles.inmuebleContent}>Pisos</div>
                          <div className={`${styles.inmuebleSubcontent} mb-1`}>
                            {inmuebles.pisos
                              ? inmuebles.pisos
                              : "S/N"}
                            <br />
                            <br />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 col-6">
                <div className="inmueble-contenido">
                  <table>
                    <tbody>
                      <tr>
                        <td valign="top">
                          <img
                            className="me-3"
                            src="/images/icons/deatails-icons/8.png"
                            alt="..."
                          />
                        </td>
                        <td>
                          <div className={styles.inmuebleContent}>
                            Antigüedad
                          </div>
                          <div className={`${styles.inmuebleSubcontent} mb-1`}>
                            {inmuebles.antiguedad
                              ? inmuebles.antiguedad
                              : "S/N"}
                            <br />
                            <br />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/*-------- detalles adicionales ------------*/}
            <Accordion defaultActiveKey="1" flush>
              <Accordion.Item eventKey="0">
                <div className="row">
                  <div className="col-sm-7 col-md-6 col-lg-4 col-xl-5 col-xxl-4 col-7">
                    <div className={styles.inmuebleSubtitle}>
                      Detalles adicionales
                    </div>
                  </div>
                  <div className="col-sm-4 col-md-5 col-lg-7 col-xl-6 col-xxl-7 col-3">
                    <hr className="mt-4" />
                  </div>
                  <div className="col-sm-1 col-md-1 col-lg-1 col-xl-1 col-xxl-1 col-1">
                    <Accordion.Button className={styles.btnAccordion} />
                  </div>
                </div>
                <Accordion.Body className={styles.acordionContent}>
                  <div className="row">
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 col-6">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/9.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>
                                  Cuenta con agua
                                </div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.agua ? "Sí" : "No"}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 col-6">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/10.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>
                                  Cuenta con luz
                                </div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.luz ? "Sí" : "No"}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 col-6">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/11.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>
                                  Cuenta con gas
                                </div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.gas ? "Sí" : "No"}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 col-6">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/12.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>
                                  Internet
                                </div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.internet ? "Sí" : "No"}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 col-6">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/13.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>
                                  Seguridad privada
                                </div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.seguridadPrivada
                                    ? "Sí"
                                    : "No"}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 col-6">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/14.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>
                                  Escuelas cercanas
                                </div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.escuelas ? "Sí" : "No"}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 col-6">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/15.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>
                                  Mantenimiento
                                </div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.mantenimiento
                                    ? "Sí"
                                    : "No"}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 col-6">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/16.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>
                                  Alberca
                                </div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.piscinas ? "Sí" : "No"}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4 col-12">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/17.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>
                                  Acceso a discapacitados
                                </div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.discapacitados
                                    ? "Sí"
                                    : "No"}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            {/*-------- detalles adicionales ------------*/}
          </div>

          {/* tarjeta de contacto */}
          {isRole && auth.uid ? (
            <div className="col-sm-12 col-md-2 col-lg-2 col-xl-3 text-center d-none d-xl-block">
              <table>
                <tbody>
                  <tr>
                    <td>
                      {/* <div
                        className={`${styles.socialMiniCard} mb-2 pointer d-none d-xxl-block`}
                      >
                        <img
                          src="/images/icons/deatails-icons/ubicacion.png"
                          alt=""
                        ></img>
                      </div> */}
                      <>
                        {inmuebles.usuario.telefonoPersonal ? (
                          <div
                            className={`${styles.socialMiniCard} mb-2 pointer d-none d-xxl-block`}
                          >
                            <a
                              href={`https://api.whatsapp.com/send?phone=${inmuebles.usuario.telefonoPersonal}&text=%C2%A1Hola!%20acabo%20de%20ver%20una%20propiedad%20tuya.%20Quisiera%20m%C3%A1s%20informaci%C3%B3n.`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src="/images/icons/deatails-icons/whats.png"
                                alt=""
                              />
                            </a>
                          </div>
                        ) : null}
                      </>

                      <>
                        {inmuebles.usuario.facebookpage ? (
                          <div
                            className={`${styles.socialMiniCard} mb-2 pointer d-none d-xxl-block`}
                          >
                            <a
                              href={`https://www.${inmuebles.usuario.facebookpage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src="/images/icons/deatails-icons/face.png"
                                alt=""
                              />
                            </a>
                          </div>
                        ) : null}
                      </>
                      <>
                        {inmuebles.usuario.instagram ? (
                          <div
                            className={`${styles.socialMiniCard} mb-2 pointer d-none d-xxl-block`}
                          >
                            <a
                              href={`https://www.${inmuebles.usuario.instagram}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src="/images/icons/deatails-icons/insta.png"
                                alt=""
                              />
                            </a>
                          </div>
                        ) : null}
                      </>
                    </td>
                    <td>
                      <div className={styles.perfilCard}>
                        <div className={styles.perfilCardImg}>
                          <img
                            src={inmuebles.usuario.img}
                            style={{
                              width: "100%",
                              borderTopLeftRadius: 30,
                              borderTopRightRadius: 30,
                            }}
                            alt={inmuebles.usuario.nombre}
                          />
                        </div>
                        {/* <Modaltitle titulo="Juan Pérez Hernández"/> */}

                        <div className={styles.perfilCardNombre}>
                            {inmuebles.usuario.nombre}{" "}
                            {inmuebles.usuario.apellido}    
                        </div>
                        

                        <div className={styles.perfilCardLine}></div>
                        <div className={styles.perfilCardCiudad}>
                          {inmuebles.usuario.direccionFisica}
                        </div>
                        {(access_token && (typeof window !== "undefined") && (auth && (inmuebles.usuario.uid != auth.uid))) && 
                        <div className="my-2">
                          <button
                            className={styles.btnDetalle}
                            onClick={() => handleOwner((inmuebles.usuario.uid)? inmuebles.usuario.uid: '')}
                          >
                            Ver perfil
                          </button>
                        </div>
                        }
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : null}

          {/* tarjeta de contacto */}

          {/*-------- equipamiento ------------*/}
          <div className="col-12">
            <Accordion defaultActiveKey="1" flush>
              <Accordion.Item eventKey="0">
                <div className="row">
                  <div className="col-sm-5 col-md-4 col-lg-3 col-xl-3 col-xxl-2 col-7">
                    <div className={styles.inmuebleSubtitle}>Equipamiento</div>
                  </div>
                  <div className="col-sm-6 col-md-7 col-lg-8 col-xl-8 col-xxl-9 col-3">
                    <hr className="mt-4" />
                  </div>
                  <div className="col-sm-1 col-md-1 col-lg-1 col-xl-1 col-xxl-1 col-1">
                    <Accordion.Button className={styles.btnAccordion} />
                  </div>
                </div>
                <Accordion.Body className={styles.acordionContent}>
                  <div className="row">
                    <div className="col-sm-6 col-md-6 col-lg-4 col-xl-3 col-6">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/18.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>
                                  Camas
                                </div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.camas ? "Sí" : "No"}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-4 col-xl-3 col-6">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/19.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>
                                  Closet
                                </div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.closet ? "Sí" : "No"}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-4 col-xl-3 col-6">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/20.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>
                                  Sala
                                </div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.sala ? "Sí" : "No"}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-4 col-xl-3 col-6">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/21.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>
                                  Comedor
                                </div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.comedor ? "Sí" : "No"}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-4 col-xl-3 col-6">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/22.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>
                                  Cocina
                                </div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.cocina ? "Sí" : "No"}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-4 col-xl-3 col-6">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/23.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>AA</div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.AA ? "Sí" : "No"}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-4 col-xl-3 col-6">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/24.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>
                                  Refrigerador
                                </div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.refrigerador
                                    ? "Sí"
                                    : "No"}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-4 col-xl-3 col-6">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/25.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>
                                  Estufa
                                </div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.estufa ? "Sí" : "No"}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-4 col-xl-3 col-6">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/26.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>
                                  Microondas
                                </div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.microondas ? "Sí" : "No"}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-4 col-xl-3 col-6">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/27.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>
                                  Mini Horno
                                </div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.minihorno ? "Sí" : "No"}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-4 col-xl-3 col-6">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/28.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>
                                  Horno
                                </div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.horno ? "Sí" : "No"}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-4 col-xl-3 col-6">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/29.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>
                                  Lavadora
                                </div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.lavadora ? "Sí" : "No"}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-4 col-xl-3 col-6">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/30.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>
                                  Secadora
                                </div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.secadora ? "Sí" : "No"}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-9">
                      <div className="inmueble-contenido">
                        <table>
                          <tbody>
                            <tr>
                              <td valign="top">
                                <img
                                  className="me-3"
                                  src="/images/icons/deatails-icons/31.png"
                                  alt="..."
                                />
                              </td>
                              <td>
                                <div className={styles.inmuebleContent}>
                                  Otros
                                </div>
                                <div
                                  className={`${styles.inmuebleSubcontent} mb-1`}
                                >
                                  {inmuebles.otros
                                    ? inmuebles.otros
                                    : 'No hay descripción para "Otros"'}
                                  <br />
                                  <br />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          {/*-------- equipamiento ------------*/}
        </div>
      </div>
    </section>
  );
};

export default Detalles;
