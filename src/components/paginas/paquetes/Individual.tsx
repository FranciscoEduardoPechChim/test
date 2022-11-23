import { FormEvent, useContext, useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/router";
import moment from "moment";
import { Form, Modal, Row, Col } from "react-bootstrap";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/auth/AuthContext";
import { formatPrice } from "../../../helpers/formatPrice";
import { usePaqueteInd } from "../../../hooks/usePaquetes";
import Button from "../../ui/button/Button";
import Loading from "../../ui/loading/Loading";
import Modaltitle from "../../ui/modaltitle/Modaltitle";
import styles from "./paquetes.module.css";
import {
  anadirPaqueteInv,
  generarRefInd,
  nuevoPedido,
  nuevoPedidoAdmin,
} from "../../../helpers/fetch";
import { Pedido } from "../../../interfaces/PedidosInterface";
import { NuevoPedido, NuevoPedidoAdmin } from "interfaces/ContactInterface";
// Context
import { PromotionContext } from '../../../context/promotions/PromotionContext';
//Components
import { useForm } from '../../../hooks/useForm';
//Services
import { storeOrder, destroyOrder, updateOrder } from '../../../services/orderService';
//Validations
import { isNotEmpty, isString } from '../../../helpers/validations';
//Helpers
import { validate } from '../../../helpers/response';
//Extras
import Swal from "sweetalert2";
import Paquetes from "pages/paquetes";

const Individual = () => {
  const { auth, abrirLogin, actualizarRol } = useContext(AuthContext);
  const [precioSeleccionado, setPrecioSeleccionado] = useState("");
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { paquete, cargando } = usePaqueteInd();
  const [mostrarPago, setMostrarPago] = useState(false);
  const [mostrarTransferencia, setMostrarTransferencia] = useState(false);

  const access_token                                                    = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
  const [ price, setPrice ]                                             = useState(0);
  const [ type, setType ]                                               = useState('');
  const [ priceAnnual, setPriceAnnual ]                                 = useState(0);
  const [ priceBiannual, setPriceBiannual ]                             = useState(0);
  const [ priceQuarterly, setPriceQuarterly ]                           = useState(0);
  const [ errorPromotion, setErrorPromotion ]                           = useState<any>([]);
  const [ code, setCode ]                                               = useState('');
  const [ subscription, setSubscription ]                               = useState(false);
  const [ order, setOrder ]                                             = useState<Pedido>();
  const { isValidPromotion, isSubscription, showOrder }                 = useContext(PromotionContext);


  const [ errorName, setErrorName ]                                     = useState([]);
  const { formulario, handleChange, setFormulario }                     = useForm({name: ''});
  const { name }                                                        = formulario;

  const handleClose                                                     = () => setShow(false);
  const handleNext                                                      = () => setShow(false);

  const handleShow                                                      = () => { 
    if(paquete) {
      switch(type) {
        case 'annual':
          setPriceAnnual(paquete.precioAnual);
        break;
        case 'biannual':
          setPriceBiannual(paquete.precioSemestral);
        break;
        case 'quarterly':
          setPriceQuarterly(paquete.precioTrimestral);
        break;
        default:
          setPriceAnnual(0);
          setPriceBiannual(0);
          setPriceQuarterly(0);
      }

      setType('');
      setPrice(0);
    }
    setCode('');
    setShow(true);
  }
  const ocultarPago                                                     = () => setMostrarPago(false);
  const ocultarTransferencia                                            = () => setMostrarTransferencia(false);

  const pagar                                                           = () => {
    handleNext();
    setMostrarPago(true);
  };

  const pagarTransferencia                                              = () => {
    handleNext();
    setMostrarTransferencia(true);
  };

  const generarReferencia                                               = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = {
      usuario: auth.uid,
      paquete: paquete?._id,
      referencia: Math.floor(
        1_000_000_000_000 + Math.random() * 9_000_000_000_000
      ),
      precio: price,
      importe: price,
      totalUsuarios: 1,
      estado: false,
    };

    const res = await generarRefInd("referencias", body);
    if (res.ok) {
      toast.success(res.msg);
      router.push("/perfil/referencias-de-pago");
    } else {
      toast.success("Error al generear la referencia. Inténtelo de nuevo");
    }
  };

  const selectQuantityUsers                                             = (name: string) => {
    if(paquete) {
      switch(name) {
        case 'annual':
          setType(name);
          setPrice(paquete.precioAnual);
        break;
        case 'biannual':
          setType(name);
          setPrice(paquete.precioSemestral);
        break;
        case 'quarterly':
          setType(name);
          setPrice(paquete.precioTrimestral);
        break;
        default:
          setType('');
          setPrice(0);
      }
    }
  }

  const onBlurChange                                                    = () => {
    setErrorPromotion([]);
  }

  const formValidate                                                    = (name: string, message: any) => {

    const messageError                                                  = message.filter((value:any) => value != '');

    if(messageError.length == 0) {
      return false;
    }

    switch(name) {
      case 'name':
        setErrorName(messageError);
      return true;
      default:
      return true;
    }
  }

  const onCancelSubscription                                            = async () => {
    Swal.fire({
      title: '¿Está de acuerdo en cancelar la subscripción?',
      text: "Al cancelar, perdera los privilegios adquiridos del paquete al cual está subscrito",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'De acuerdo'
    }).then(async (result) => {
      if (result.isConfirmed) {
        if(auth.uid && access_token) {
          const response                                                = await destroyOrder(auth.uid, access_token);
    
          if(response && response.ok) {
            toast.error(response.msg);
            return false;
          }
    
          if(response && response.data) {
            toast.success(response.msg);
    
            localStorage.setItem("role", 'Usuario');
            
            await actualizarRol(
              {
                role:             'Usuario',
                paqueteAdquirido: '',
              },
              auth.uid
            );
    

            router.push("/perfil/historial-de-pagos");
          }
          
        }
      }
    })
  }
  
  const validPromotion                                                  = async ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value }                                               = target;
    setErrorPromotion([]);

    if(value && (value.trim().length > 0) && access_token && (price > 0)) {
      const response                                                    = await isValidPromotion(value, access_token);
  
        if(response && type && (typeof response == 'string')) {
          setErrorPromotion((typeof response != 'undefined') ? [response]:[]);    

          if(paquete) {
            switch(type) {
              case 'annual':
                setPriceAnnual(paquete.precioAnual);
                setPrice(paquete.precioAnual);
              break;
              case 'biannual':
                setPriceBiannual(paquete.precioSemestral);
                setPrice(paquete.precioSemestral);
              break;
              case 'quarterly':
                setPriceQuarterly(paquete.precioTrimestral);
                setPrice(paquete.precioTrimestral);
              break;
              default:
                setPriceAnnual(0);
                setPriceBiannual(0);
                setPriceQuarterly(0);
                setPrice(0);
            }
          }
         
        }else {
          setErrorPromotion([]);
          
          if((typeof response == 'object') && response && type && paquete) {    
            let total           = 0;
            let subTotal        = (type == 'annual') ? paquete.precioAnual:((type == 'biannual') ? paquete.precioSemestral:paquete.precioTrimestral);
  
            if(response.type == 0) {
              total             = Number(subTotal) - Number(response.quantity);
            }else {
              const discount    = Number(subTotal) * (Number(response.quantity) / 100);
              total             = Number(subTotal) - Number(discount);
            }
  
            switch(type) {
              case 'annual':
                setPriceAnnual(total);
              break;
              case 'biannual':
                setPriceBiannual(total);
              break;
              case 'quarterly':
                setPriceQuarterly(total);
              break;
              default:
                setPriceAnnual(0);
                setPriceBiannual(0);
                setPriceQuarterly(0);
            }
          
            setCode(value);
            setPrice(total);
          }
        }
    }
  }

  const onSubmit                                                        = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      setErrorName([]);

      const formName                                                    = formValidate('name', [isNotEmpty(name), isString(name)]);
      
      if(formName) {
        return false;
      }

      if (!stripe || !elements) return;

      const { error, paymentMethod }                                    = await stripe.createPaymentMethod({
        type:                                                           "card",
        card:                                                           elements.getElement(CardElement)!,
        billing_details: {
          name:                                                         name
        },
      });

      if (!error && access_token) {
        setLoading(true);
        const paymentDate                                               = moment().format();
        const expirationDate                                            = (type == 'annual') ? moment(paymentDate).add(1, "y").format(): ((type == 'biannual')  ? moment(paymentDate).add(6, "M").format():moment(paymentDate).add(3, "M").format());
        const payment                                                   = paymentMethod;

        if(payment && (typeof auth.uid == 'string') && paquete) {
          const response                                                = await storeOrder(auth.uid, paquete._id, 1, 'individual_' + type, paymentDate, expirationDate, payment.type, payment.id, (code != '') ? code:null, name, access_token);
         
          if(response && response.errors) {
            validate(response.errors);
            return false;
          }

          if(response && response.ok) {
              toast.error(response.msg);
              return false;
          }

          if(response && response.data) {
            if(auth.role !== 'Administrador') {
              await actualizarRol(
                {
                  role:                                                 paquete.nombre,
                  paqueteAdquirido:                                     paquete._id,
                  usuarios:                                             1,
                },
                auth.uid
              )
            }

            localStorage.setItem("role", paquete.nombre);
            toast.success(response.msg);
            ocultarPago();
            router.push("/perfil/historial-de-pagos");
          }
        }

        setLoading(false);
      }
  
    } catch (error) {
      console.log(error);
    }

  




    // if (!error) {
    //   const pago = paymentMethod;
    //   const body: Pedido = {
    //     usuario: auth.uid,
    //     paquete: paquete?._id,
    //     precio: Number(precioSeleccionado),
    //     importe: Number(precioSeleccionado),
    //     fechaPago,
    //     fechaVencimiento:
    //       Number(precioSeleccionado) === 1250
    //         ? fechaVencimientoTri
    //         : Number(precioSeleccionado) === 2799
    //         ? fechaVencimientoSem
    //         : fechaVencimiento,
    //     metodoPago: pago?.type,
    //     vigencia: true,
    //     idPago: pago?.id,
    //     totalUsuarios: 1,
    //   };

    //   // const correoPedido: NuevoPedido = {
    //   //   apellido: auth.apellido,
    //   //   nombre: auth.nombre,
    //   //   correo: auth.correo,
    //   //   idCompra: pago?.id,
    //   //   nombrePaquete: paquete?.nombre,
    //   //   precio: Number(precioSeleccionado),
    //   //   importe: Number(precioSeleccionado),
    //   // };

    //   // const correoPedidoAdmin: NuevoPedidoAdmin = {
    //   //   apellido: auth.apellido,
    //   //   nombre: auth.nombre,
    //   //   idCompra: pago?.id,
    //   //   nombrePaquete: paquete?.nombre,
    //   //   precio: Number(precioSeleccionado),
    //   //   importe: Number(precioSeleccionado),
    //   // };

    //   try {
    //     const resp = await anadirPaqueteInv("pedidos", body);
    //     auth.role !== "Administrador"
    //       ? await actualizarRol(
    //           {
    //             role: paquete?.nombre,
    //             paqueteAdquirido: paquete?._id,
    //           },
    //           auth.uid
    //         )
    //       : null;

    //     // await nuevoPedido("correos/nuevo-pedido", correoPedido);
    //     // await nuevoPedidoAdmin("correos/nuevo-pedido-admin", correoPedidoAdmin);

    //     if (resp.ok) {
    //       toast.success(resp.msg);
    //       ocultarPago();
    //       router.push("/perfil/historial-de-pagos");
    //     }

    //     if (!resp.ok) toast.error(resp.msg);

    //     setLoading(false);
    //   } catch (error) {
    //     console.log(error);
    //   }
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    const initSubscription                                              = async () => {
      if(auth.uid) {
        const subscriptionData                                          = await isSubscription(auth.uid, (access_token) ? access_token:""); 
        const orderData                                                 = await showOrder(auth.uid, (access_token) ? access_token:"");

        if(subscriptionData && typeof subscriptionData == 'boolean') {
          setSubscription(subscriptionData);
        }

        // if(orderData && orderData._id) {
        //   setOrder(orderData);
        // }
      }
    }

    initSubscription();
  }, []);

  return (
    <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-4">
      <div className={styles.paquetesCard}>
        {cargando ? (
          <Loading />
        ) : (
          <>
            <div className="d-flex justify-content-center">
              <img src="/images/icons/individual.png" alt="Paquete" />
            </div>
            <div className={`${styles.paquetesCardTitle}  my-4 text-center`}>
              {paquete?.nombre}
            </div>
            <hr />
            <ul>
              <table className={styles.tabla}>
                <tbody>
                  <tr>
                    <td className="tupla">
                      <li className={styles.listItems}>Anual</li>
                    </td>
                    <td className="tupla">
                      <div className={styles.paquetesCardPrecio2}>
                        {formatPrice(paquete!.precioAnual)}MXN
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="tupla">
                      <li className={styles.listItems}>Semestral</li>
                    </td>
                    <td className="tupla">
                      <div className={styles.paquetesCardPrecio2}>
                        {formatPrice(paquete!.precioSemestral)}MXN
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="tupla">
                      <li className={styles.listItems}>Trimestral</li>
                    </td>
                    <td className="tupla">
                      <div className={styles.paquetesCardPrecio2}>
                        {formatPrice(paquete!.precioTrimestral)}MXN
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <li className={styles.listItems}>{paquete?.descripcion}</li>
            </ul>
            <div className={`${styles.ajusteBtn} text-center`}>
              {auth.uid ? (
                <>
                  {auth.role === "Individual" ? (
                    <div className="row">
                      <div className="col-12">
                        <button
                          type      = "button"
                          className = {styles.btnContract}
                        >
                          CONTRATADO
                        </button>
                      </div>
                      {subscription && 
                        <div className="col-12 mt-2">
                          <span className={styles.cancel} onClick={onCancelSubscription}>Cancelar</span>
                        </div>
                      } 
                    </div>
                  ) : (
                    <>
                      {auth.role === "Básico" ||
                      auth.role === "Intermedio" ||
                      auth.role === "Avanzado" ? (
                        <Button titulo="Contratar" btn="Disabled" />
                      ) : (
                        <button
                          onClick={handleShow}
                          type="button"
                          className={styles.btnContratar}
                        >
                          CONTRATAR
                        </button>
                      )}
                    </>
                  )}
                </>
              ) : (
                <button
                  onClick={abrirLogin}
                  type="button"
                  className={styles.btnContratar}
                >
                  CONTRATAR
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <Modal show={show} onHide={handleClose} contentClassName={styles.modalS1}>
        <Modal.Header closeButton className={styles.modalS1header} />
        <Modal.Body>
          <div className={styles.headTitle}>
            <Modaltitle titulo="Individual" />
          </div>
          <div className={`${styles.S1content} text-center mt-5 mb-4`}>
            Selecciona el tipo de plan que desea.
          </div>
          {loading ? <Loading /> : null}
          <div>
            <div className="row d-flex justify-content-center">
              <div className="col-sm-12 col-md-12 col-lg-9">
                <div className="row d-flex justify-content-center">
                  <div className="col-4">
                    <div className={`${styles.S1labels}`}>Anual</div>
                  </div>
                  <div className="col-7 text-end mb-2">
                    <input
                      value={paquete?.precioAnual}
                      onChange={(e) => selectQuantityUsers('annual')}
                      type="radio"
                      name="individual"
                    />
                    <span className={`${styles.precio} ms-2`}>
                      {paquete ? (
                        <>{formatPrice((priceAnnual > 0) ? priceAnnual:paquete?.precioAnual)} MXN</>
                      ) : null}
                    </span>
                  </div>
                  <div className="col-4">
                    <div className={`${styles.S1labels}`}>Semestral</div>
                  </div>
                  <div className="col-7 text-end mb-2">
                    <input
                      value={paquete?.precioSemestral}
                      onChange={(e) => selectQuantityUsers('biannual')}
                      type="radio"
                      name="individual"
                    />
                    <span className={`${styles.precio} ms-2`}>
                      {paquete ? (
                        <>{formatPrice((priceBiannual > 0) ? priceBiannual:paquete.precioSemestral)} MXN</>
                      ) : null}
                    </span>
                  </div>
                  <div className="col-4">
                    <div className={`${styles.S1labels}`}>Trimestral</div>
                  </div>
                  <div className="col-7 text-end mb-2">
                    <input
                      value={paquete?.precioTrimestral}
                      type="radio"
                      name="individual"
                      onChange={(e) => selectQuantityUsers('quarterly')}
                    />
                    <span className={`${styles.precio} ms-2`}>
                      {paquete ? (
                        <>{formatPrice((priceQuarterly > 0) ? priceQuarterly:paquete!.precioTrimestral)} MXN</>
                      ) : null}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {(!subscription) && 
            <div className="row my-2 d-flex justify-content-center">
              <div className="col-sm-12 col-md-12 col-lg-9">
                  <div className="form-group">
                      <Form.Label className={styles.S3labels} htmlFor="discount">¿Tienes un descuento?</Form.Label>
                      {(price > 0) ? 
                        <Form.Control className='mb-1' id="discount" type="text" name="discount" placeholder="Aplicar aquí..." onChange={validPromotion} onBlur={onBlurChange} />:
                        <Form.Control className='mb-1' id="discount" type="text" name="discount" placeholder="Aplicar aquí..." disabled/>
                      }
                      {(errorPromotion) && (errorPromotion.length != 0) && errorPromotion.map((value: any, key: any) => {
                          return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                      })}
                  </div>
              </div>
            </div>}


            <div className="text-center mt-5">

              {(price > 0) ? (
                <>
                  <Button titulo="Pagar con tarjeta" onClick={pagar} />
                  <Button
                    titulo="Transferencia bancaria"
                    onClick={pagarTransferencia}
                  />
                </>
              ) : (
                <>
                  <Button titulo="Pago con tarjeta" btn="Disabled" />
                  <Button titulo="Transferencia bancaria" btn="Disabled" />
                </>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        contentClassName={styles.modalS1}
        show={mostrarPago}
        onHide={ocultarPago}
      >
        <Modal.Header closeButton className={styles.modalS1header} />
        <Modaltitle titulo="Paquete individual" />

        <div className={`${styles.S1content} text-center`}>
          Cantidad a pagar:{" "}
          <span className={`${styles.precio}`}>
            {formatPrice(price)} MXN
          </span>
        </div>

        <br />
        <Form onSubmit={onSubmit}>
          <Row>
            <Col className="form-group px-5 my-2"  md sm xs={12} >
              <Form.Label className={styles.S3labels} htmlFor="name">Titular de la tarjeta *</Form.Label>
              <Form.Control id="name" type="text" name="name" placeholder="Jhon Miller" onChange={handleChange} />
              {(errorName) && (errorName.length != 0) && errorName.map((value: any, key: any) => {
                  return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
              })}
            </Col>
          </Row> 
          <Row>
            <Col className="form-group px-5 my-3" md sm xs={12}>
              <CardElement
                options={{
                  hidePostalCode: true,
                  style: {
                    base: {
                      iconColor: "#2C2C2C",
                      color: "#2C2C2C",
                      fontWeight: "500",
                      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
                      fontSize: "16px",
                      "::placeholder": {
                        color: "#757575",
                      },
                    },
                    invalid: {
                      iconColor: "#E44122",
                      color: "#E44122",
                    },
                  },
                }}
              />
            </Col>
          </Row>
          <div className="text-center my-4">
            {!stripe ? (
              <Button titulo="Pagar" btn="Disabled" />
            ) : (
              <div>
                {loading ? <Loading /> : <Button titulo="Finalizar pedido" />}
              </div>
            )}
          </div>
        </Form>
      </Modal>

      <Modal
        contentClassName={styles.modalS1}
        show={mostrarTransferencia}
        onHide={ocultarTransferencia}
      >
        <Modal.Header closeButton className={styles.modalS1header} />
        <Modaltitle titulo="Paquete individual" />

        <div className={`${styles.S1content} text-center`}>
          Cantidad a pagar:{" "}
          <span className={`${styles.precio}`}>
            {formatPrice(Number(price))} MXN
          </span>
        </div>

        <br />
        <Form onSubmit={generarReferencia}>
          <div className="text-center">
            <div className="p-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Id
              maiores neque harum distinctio cumque ratione dolorum quam aperiam
              aut repudiandae in quas architecto molestias quo est obcaecati,
              similique, voluptatum consectetur!
            </div>
            <Button titulo="Generar referencia" />
          </div>
          <br />
        </Form>
      </Modal>
    </div>
  );
};

export default Individual;
