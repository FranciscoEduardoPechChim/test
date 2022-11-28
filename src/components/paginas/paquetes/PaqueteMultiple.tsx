import { FormEvent, useContext, useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/router";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Form, Modal, Col, Row } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import moment from "moment";
import { AuthContext } from "../../../context/auth/AuthContext";
import { formatPrice } from "../../../helpers/formatPrice";
import { useForm } from "../../../hooks/useForm";
import Button from "../../ui/button/Button";
import Modaltitle from "../../ui/modaltitle/Modaltitle";
import styles from "./paquetes.module.css";
import {
  anadirPaqueteInv,
  generarRefMul,
  nuevoPedido,
  nuevoPedidoAdmin,
} from "../../../helpers/fetch";
import Loading from "../../ui/loading/Loading";
import { NuevoPedido, NuevoPedidoAdmin } from "interfaces/ContactInterface";
//Interfaces
import { Pedido } from '../../../interfaces/PedidosInterface';
// Context
import { PromotionContext } from '../../../context/promotions/PromotionContext';
//Services
import { storeOrder, destroyOrder, updateOrder } from '../../../services/orderService';
//Validations
import { isNotEmpty, isString } from '../../../helpers/validations';
//Helpers
import { validate } from '../../../helpers/response';
//Extras
import Swal from "sweetalert2";

interface Props {
  id: string;
  titulo: string;
  precio: number;
  descripcion: string;
  options?: any;
  avanzado?: boolean;
  usuario?: number;
}

const PaqueteMultiple                                                   = (props: Props) => {
  const access_token                                                    = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
  const { titulo, precio, descripcion, options, avanzado, usuario, id } = props;
  const { auth, abrirLogin, actualizarRol }                             = useContext(AuthContext);
  const { isValidPromotion, isSubscription, showOrder }                 = useContext(PromotionContext);
  const { formulario, handleChange, setFormulario }                     = useForm({usuarios: 11, name: ''});
  const { usuarios, name }                                              = formulario;
  const [ show, setShow ]                                               = useState(false);
  const [ mostrarPago, setMostrarPago ]                                 = useState(false);
  const [ loading, setLoading ]                                         = useState(false);
  const [mostrarTransferencia, setMostrarTransferencia]                 = useState(false);
  const [usuariosSeleccionados, setUsuariosSeleccionados]               = useState<any>(usuario);
  const router                                                          = useRouter();
  const stripe                                                          = useStripe();
  const elements                                                        = useElements();
  const [ errorPromotion, setErrorPromotion ]                           = useState<any>([]);
  const [ price, setPrice ]                                             = useState(0); 
  const [ userTotal, setUserTotal ]                                     = useState(11);
  const [ code, setCode ]                                               = useState('');
  const [ errorName, setErrorName ]                                     = useState([]);
  const [ subscription, setSubscription ]                               = useState(false);
  const [ order, setOrder ]                                             = useState<Pedido>();
  const [ discounts, setDiscounts ]                                     = useState(0);
  
  const handleClose                                                     = () =>  setShow(false);
  
  const handleShow                                                      = async () => { 
    setDiscounts(0);

    if(avanzado && auth) {
      let discount                                                      = 0;
    
      if(order && order.precio && order.totalUsuarios) {
        const startDate                                                 = moment(order.fechaPago);
        const endDate                                                   = moment();
        discount                                                        = ((auth.role != 'Individual') && (auth.role != 'Usuario') && ((order.precio != 1250) && (order.precio != 1999))) ? (endDate.diff(startDate, 'months') + 1) * ((Number(order.precio) * Number(order.totalUsuarios))/12):((order.precio == 1250) ? (endDate.diff(startDate, 'months') + 1) * ((Number(order.precio) * Number(order.totalUsuarios))/3):(endDate.diff(startDate, 'months') + 1) * ((Number(order.precio) * Number(order.totalUsuarios))/6) );
      }

      setDiscounts(discount);
      setFormulario({usuarios: 11, name: ''});
      setPrice((Number(11) * Number(precio)) - discount);
      setUserTotal(11);
    }else {
      setUsuariosSeleccionados(usuario);
      setPrice(Number(precio));
    }
    setCode('');
    setErrorPromotion([]);
    setShow(true);
  };

  const ocultarPago                                                     = () => setMostrarPago(false);
  
  const handleNext                                                      = () => setShow(false);

  const pagar                                                           = () => {
    handleNext();
    setMostrarPago(true);
    !avanzado ? setUsuariosSeleccionados(usuariosSeleccionados.value) : null;
  };

  const selectQuantityUsers                                             = (data: any) => {
    const { label, value }                                              = data;
    let discount                                                        = 0;

    if(order && order.precio && order.totalUsuarios) {
      const startDate                                                   = moment(order.fechaPago);
      const endDate                                                     = moment();
      discount                                                          = ((auth.role != 'Individual') && (auth.role != 'Usuario') && ((order.precio != 1250) && (order.precio != 1999))) ? (endDate.diff(startDate, 'months') + 1) * ((Number(order.precio) * Number(order.totalUsuarios))/12):((order.precio == 1250) ? (endDate.diff(startDate, 'months') + 1) * ((Number(order.precio) * Number(order.totalUsuarios))/3):(endDate.diff(startDate, 'months') + 1) * ((Number(order.precio) * Number(order.totalUsuarios))/6) );
    }

    setDiscounts(discount);
    setPrice((Number(precio) * Number(value)) - discount);
    setUsuariosSeleccionados(data);
  }

  const writeQuantityUsers                                              = (data: any) => {
    const { name, value }                                               = data.target;
    let discount                                                        = 0;

    if(order && order.precio && order.totalUsuarios) {
      const startDate                                                   = moment(order.fechaPago);
      const endDate                                                     = moment();
      discount                                                          = ((auth.role != 'Individual') && (auth.role != 'Usuario') && ((order.precio != 1250) && (order.precio != 1999))) ? (endDate.diff(startDate, 'months') + 1) * ((Number(order.precio) * Number(order.totalUsuarios))/12):((order.precio == 1250) ? (endDate.diff(startDate, 'months') + 1) * ((Number(order.precio) * Number(order.totalUsuarios))/3):(endDate.diff(startDate, 'months') + 1) * ((Number(order.precio) * Number(order.totalUsuarios))/6) );
    }

    setDiscounts(discount);
    setUserTotal(Number(value));
    setPrice((Number(precio) * Number(value)) - discount);
    handleChange(data);
  }

  const ocultarTransferencia                                            = () => setMostrarTransferencia(false);
  
  const pagarTransferencia                                              = () => {
    handleNext();
    setMostrarTransferencia(true);
  };

  const generarReferencia                                               = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = {
      usuario: auth.uid,
      paquete: id,
      referencia: Math.floor(
        1_000_000_000_000 + Math.random() * 9_000_000_000_000
      ),
      precio: Number(precio),
      importe: Number(price),
      totalUsuarios: avanzado ? Number(usuarios) : usuariosSeleccionados.value,
      estado: false,
    };

    const res = await generarRefMul("referencias", body);

    if (res.ok) {
      toast.success(res.msg);
      router.push("/perfil/referencias-de-pago");
    } else {
      toast.success("Error al generear la referencia. Inténtelo de nuevo");
    }
  };

  const onBlurChange                                                    = () => {
    setErrorPromotion([]);
  }

  const validPromotion                                                  = async ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value }                                               = target;
    setErrorPromotion([]);

    if(value && (value.trim().length > 0) && access_token && (price > 0)) {
      const response                                                    = await isValidPromotion(value, access_token);
  
        if(response && (typeof response == 'string')) {
          setErrorPromotion((typeof response != 'undefined') ? [response]:[]);
          let total               = 0;

          if(avanzado) {
            total                 = Number(usuarios) * Number(precio);
          }else {
            const { label, value }                                          = usuariosSeleccionados;
            total                 = Number(value) * Number(precio);
          }
      
          setPrice(total);
        }else {
          setErrorPromotion([]);
          if((typeof response == 'object') && response) {    
            let total           = 0;
            let price           = 0;

            if(avanzado) {
              price             = Number(usuarios) * Number(precio);
            }else {
              const { label, value }                                        = usuariosSeleccionados;
              price             = Number(value) * Number(precio);
            }


            if(response.type == 0) {    
              total             = Number(price) - Number(response.quantity);
            }else {
              const discount    = Number(price) * (Number(response.quantity) / 100);
              total             = Number(price) - Number(discount);
            }
  
            setCode(value);
            setPrice(total);
          }
        }
    }
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

  const changePaymentCard                                               = async () => {
    setLoading(true);

    if(typeof auth.uid == 'string' && access_token) {
      const paymentDate                                                 = moment().format();
      const quantity                                                    = (avanzado) ? userTotal:usuariosSeleccionados.value;
      const type                                                        = (avanzado) ? ((userTotal >= 11) ? 'advanced':''):( (usuariosSeleccionados.value >= 3 && usuariosSeleccionados.value <= 5) ? 'basic': ((usuariosSeleccionados.value >= 6 && usuariosSeleccionados.value <= 10) ? 'intermediate':'' ));

      const response                                                    = await updateOrder(auth.uid, id, quantity, type, paymentDate, paymentDate, discounts, access_token);

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
              role:                                                 titulo,
              paqueteAdquirido:                                     id,
              usuarios:                                             quantity,
            },
            auth.uid
          )
        }
        localStorage.setItem("role", titulo);
        toast.success(response.msg);
        ocultarPago();
        router.push("/perfil/historial-de-pagos");
      }

    }

    setLoading(false);
  }

  const changePaymentRef                                                = async () => {
    Swal.fire({
      title: '¿Está de acuerdo en realizar el pago por referencia?',
      text: "Al realizar el pago por referencia, se cancelara la subscripción una vez confirmado el pago hasta 10 días hábiles",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'De acuerdo'
    }).then(async (result) => {
      if (result.isConfirmed) {
        handleNext();
        setMostrarTransferencia(true);
      }
    });
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
        const expirationDate                                            = moment(paymentDate).add(1, "y").format();
        const payment                                                   = paymentMethod;

        if(payment && (typeof auth.uid == 'string')) {
          const type                                                    = (avanzado) ? ((userTotal >= 11) ? 'advanced':''):( (usuariosSeleccionados >= 3 && usuariosSeleccionados <= 5) ? 'basic': ((usuariosSeleccionados >= 6 && usuariosSeleccionados <= 10) ? 'intermediate':'' ));
          const response                                                = await storeOrder(auth.uid, id, (avanzado) ? userTotal:usuariosSeleccionados, type, paymentDate, expirationDate, payment.type, payment.id, (code != '') ? code:null, name, access_token);

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
                  role:                                                 titulo,
                  paqueteAdquirido:                                     id,
                  usuarios:                                             (avanzado) ? userTotal:usuariosSeleccionados,
                },
                auth.uid
              )
            }
            localStorage.setItem("role", titulo);
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
  };

  useEffect(() => {
    const initSubscription                                              = async () => {
      if(auth.uid) {
        const subscriptionData                                          = await isSubscription(auth.uid, (access_token) ? access_token:""); 
        const orderData                                                 = await showOrder(auth.uid, (access_token) ? access_token:"");

        if(subscriptionData && typeof subscriptionData == 'boolean') {
          setSubscription(subscriptionData);
        }

        if(orderData && orderData._id) {
          setOrder(orderData);
        }
      }
    }

    initSubscription();
  }, []);

  return (
    <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-4">
      <div className={styles.paquetesCard}>
        <div className="d-flex justify-content-center">
          <img src="/images/icons/basico.png" alt="..." />
        </div>
        <div className={`${styles.paquetesCardTitle}  my-4 text-center`}>
          {titulo}
        </div>
        <hr />
        <div className={`${styles.paquetesCardPrecio} text-center`}>
          {formatPrice(precio)} MXN
        </div>
        <ul>
          <li className={styles.listItems}>Anuales</li>
          <li className={styles.listItems}>{descripcion}</li>
        </ul>
        <div className={`${styles.ajusteBtn} text-center`}>
          <>
            {auth.uid ? (
              <>
                {auth.role === titulo ? (
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
                    {auth.role === "Intermedio" ? (
                      (titulo == 'Básico') ?
                      <Button titulo="Contratar" btn="Disabled" />:
                      <button
                          onClick={handleShow}
                          type="button"
                          className={styles.btnContratar}
                          >
                          CONTRATAR
                      </button>
                    ) : (
                      <>
                        {auth.role === "Avanzado" ? (
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
          </>
        </div>
      </div>
      <Modal show={show} onHide={handleClose} contentClassName={styles.modalS2}>
        <Modal.Header closeButton className={styles.modalS2header} />
        <Modal.Body>
          <div className={styles.headTitle}>
            <Modaltitle titulo={titulo} />
          </div>
          <div className={`${styles.S2content} text-center mt-5 mb-4`}>
            Especifique el número de<br /> usuarios a contratar.
          </div>
          <div>
            {avanzado ? (
              <>
                <div className="row d-flex justify-content-center">
                  <div className="col-10">
                    <div className="row d-flex justify-content-between">
                      <div className="col-9">
                        <div className={`${styles.S2labels}`}>
                          Digite el número de usuarios
                        </div>
                      </div>
                      <div className="col-3">
                        <input
                          type      = "number"
                          min       = {11}
                          name      = "usuarios"
                          value     = {usuarios}
                          onChange  = {writeQuantityUsers}
                          className = {styles.inputS2}
                        />
                      </div>
                      {usuarios < 11 ? (
                        <div
                          className={`col-12 text-center my-4 ${styles.paqueteInvalido}`}
                        >
                          Paquete válido para 11 usuarios en adelante
                        </div>
                      ) : (
                        <>
                          <div
                            className={`${styles.precioAPagar} col-12 text-center mt-4 mb-5`}
                          >
                            {formatPrice(price)}
                          </div>
                        </>
                      )}

                      {(!subscription) && 
                        <div className="col-12">
                          <div className="form-group">
                            <Form.Label className={styles.S3labels} htmlFor="discount">¿Tienes un descuento?</Form.Label>
                            {usuarios && (usuarios >= 11) ? 
                              <Form.Control className='mb-1' id="discount" type="text" name="discount" placeholder="Aplicar aquí..." onChange={validPromotion} onBlur={onBlurChange} />:
                              <Form.Control className='mb-1' id="discount" type="text" name="discount" placeholder="Aplicar aquí..." disabled/>
                            }
                            {(errorPromotion) && (errorPromotion.length != 0) && errorPromotion.map((value: any, key: any) => {
                                return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                            })}
                          </div>
                        </div>
                      }
                      {(subscription) && (loading) &&
                        <div className="col-12">
                          <Loading /> 
                        </div>
                      }

                      {usuarios && (usuarios >= 11) && (!subscription) ?
                          <div className="col-12 d-flex justify-content-center mt-3 mb-3">
                            <Button titulo="Pago con tarjeta" onClick={pagar} />
                            <Button
                              titulo="Transferencia bancaria"
                              onClick={pagarTransferencia}
                            />
                          </div>:
                          <div className="col-12 d-flex justify-content-center mt-3 mb-3">
                            <Button
                              titulo="Pago con tarjeta"
                              onClick={changePaymentCard}
                            />
                            <Button
                              titulo="Transferencia bancaria"
                              onClick={changePaymentRef}
                            />
                          </div>
                      }

                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="row d-flex justify-content-center ">
                  <div className="col-sm-12 col-md-12 col-lg-9">
                    <div className="row d-flex justify-content-between">
                      <div className="col-8">
                        <div className={`${styles.S2labels}`}>
                          Número de usuarios
                        </div>
                      </div>
                      <div className="col-4">
                        <Select
                          defaultValue    = {usuariosSeleccionados}
                          onChange        = {selectQuantityUsers}
                          options         = {options}
                          classNamePrefix = {styles.selectS2}
                        />
                      </div>
                      <div className="col-12">
                        <div className="text-center mt-2">
                          {usuariosSeleccionados.value ? (
                            <div
                              className={`${styles.precioAPagar} text-center`}
                            >
                              {formatPrice(price) + " MXN"}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      {(!subscription) && 
                      <div className="col-12">
                        <div className="form-group mt-4 mb-2">
                          <Form.Label className={styles.S3labels} htmlFor="discount">¿Tienes un descuento?</Form.Label>
                          {(usuariosSeleccionados.value) ? 
                            <Form.Control className='mb-1' id="discount" type="text" name="discount" placeholder="Aplicar aquí..." onChange={validPromotion} onBlur={onBlurChange} />:
                            <Form.Control className='mb-1' id="discount" type="text" name="discount" placeholder="Aplicar aquí..." disabled/>
                          }
                          {(errorPromotion) && (errorPromotion.length != 0) && errorPromotion.map((value: any, key: any) => {
                              return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                          })}
                        </div>
                      </div>
                      }
                      {(subscription) && (loading) &&
                        <div className="col-12">
                          <Loading /> 
                        </div>
                      }
                      <div className="col-12">
                        <div className="text-center mt-5">
                          {!usuariosSeleccionados.value ? (
                            (!subscription) ?
                            <div className="d-flex justify-content-center">
                              <Button
                                titulo="Pago con tarjeta"
                                btn="Disabled"
                              />
                              <Button
                                titulo="Transferencia bancaria"
                                btn="Disabled"
                              />
                            </div>:
                            <div className="d-flex justify-content-center mb-1">
                              <Button
                                  titulo="Pago con tarjeta"
                                  btn="Disabled"
                                />
                                <Button
                                  titulo="Transferencia bancaria"
                                  btn="Disabled"
                                />
                            </div>
                          ) : (
                            (!subscription) ?
                              <div className="d-flex justify-content-center">
                                <Button
                                  titulo="Pago con tarjeta"
                                  onClick={pagar}
                                />
                                <Button
                                  titulo="Transferencia bancaria"
                                  onClick={pagarTransferencia}
                                />
                              </div>:
                              <div className="d-flex justify-content-center mb-1">
                                <Button
                                  titulo="Pago con tarjeta"
                                  onClick={changePaymentCard}
                                />
                                <Button
                                  titulo="Transferencia bancaria"
                                  onClick={changePaymentRef}
                                />
                             </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={mostrarPago} onHide={ocultarPago}>
        <Modal.Header closeButton className={styles.modalS1header} />
        <Modaltitle titulo={titulo} />

        <div className={`${styles.S1content} text-center`}>
          Cantidad a pagar:{" "}
          <span className={`${styles.precio}`}>
            {avanzado
              ? formatPrice(Number(price))
              : formatPrice(Number(price))}
            MXN
          </span>
        </div>

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
        <Modaltitle titulo={titulo} />

        <div className={`${styles.S1content} text-center`}>
          Cantidad a pagar:{" "}
          <span className={`${styles.precio}`}>
            {avanzado
              ? formatPrice(Number(price))
              : formatPrice(Number(price))}
            MXN
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

export default PaqueteMultiple;
