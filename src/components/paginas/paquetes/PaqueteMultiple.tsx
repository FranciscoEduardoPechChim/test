import { FormEvent, useContext, useState, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Form, Modal } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import moment from "moment";
import { AuthContext } from "../../../context/auth/AuthContext";
import { formatPrice } from "../../../helpers/formatPrice";
import { useForm } from "../../../hooks/useForm";
import Button from "../../ui/button/Button";
import Modaltitle from "../../ui/modaltitle/Modaltitle";
import styles from "./paquetes.module.css";
import { Pedido } from "../../../interfaces/PedidosInterface";
import {
  anadirPaqueteInv,
  generarRefMul,
  nuevoPedido,
  nuevoPedidoAdmin,
} from "../../../helpers/fetch";
import Loading from "../../ui/loading/Loading";
import { NuevoPedido, NuevoPedidoAdmin } from "interfaces/ContactInterface";
// Context
import { PromotionContext } from '../../../context/promotions/PromotionContext';

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
  const access_token                                                    = localStorage.getItem("token");
  const { titulo, precio, descripcion, options, avanzado, usuario, id } = props;
  const { auth, abrirLogin, actualizarRol }                             = useContext(AuthContext);
  const { isValidPromotion }                                            = useContext(PromotionContext);
  const { formulario, handleChange, setFormulario }                     = useForm({usuarios: 11});
  const { usuarios }                                                    = formulario;
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

  const handleClose                                                     = () =>  setShow(false);
  
  const handleShow                                                      = () => { 
    if(avanzado) {
      setFormulario({usuarios: 11});
      setPrice(Number(11) * Number(precio));
    }else {
      setUsuariosSeleccionados(usuario);
      setPrice(Number(precio));
    }
    setErrorPromotion([]);
    setShow(true)
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
    setPrice(Number(precio) * Number(value));
    setUsuariosSeleccionados(data);
  }

  const writeQuantityUsers                                              = (data: any) => {
    const { name, value }                                               = data.target;
    setPrice(Number(precio) * Number(value));
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

    if(value && (value.trim().length > 0) && access_token) {
      const response                                                    = await isValidPromotion(value, access_token);
  
        if(response && (typeof response == 'string')) {
          setErrorPromotion((typeof response != 'undefined') ? [response]:[]);
  
          if(avanzado) {
            setPrice(Number(usuarios) * Number(precio));
          }else {
            const { label, value }                                          = usuariosSeleccionados;
            setPrice(Number(value) * Number(precio));
          }
      
         
        }else {
          setErrorPromotion([]);
          if((typeof response == 'object') && response) {    
            let total           = 0;
  
            if(response.type == 0) {
              total             = Number(price) - Number(response.quantity);
            }else {
              const discount    = Number(price) * (Number(response.quantity) / 100);
              total             = Number(price) - Number(discount);
            }
  
            setPrice(total);
          }
        }
    }
  }

  const onSubmit                                                        = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement)!,
    });

    setLoading(true);

    const fechaPago = moment().format();
    const fechaVencimiento = moment(fechaPago).add(1, "y").format();

    if (!error) {
      const pago = paymentMethod;
      const body: Pedido = {
        usuario: auth.uid,
        paquete: id,
        precio: Number(precio),
        importe: avanzado
          ? Number(precio) * Number(usuarios)
          : Number(precio) * Number(usuariosSeleccionados),
        fechaPago,
        fechaVencimiento,
        metodoPago: pago?.type,
        vigencia: true,
        idPago: pago?.id,
        totalUsuarios: avanzado ? usuarios : usuariosSeleccionados,
      };

      const correoPedido: NuevoPedido = {
        apellido: auth.apellido,
        nombre: auth.nombre,
        correo: auth.correo,
        idCompra: pago?.id,
        nombrePaquete: titulo,
        precio: Number(precio),
        importe: avanzado
          ? Number(precio) * Number(usuarios)
          : Number(precio) * Number(usuariosSeleccionados),
      };

      const correoPedidoAdmin: NuevoPedidoAdmin = {
        apellido: auth.apellido,
        nombre: auth.nombre,
        idCompra: pago?.id,
        nombrePaquete: titulo,
        precio: Number(precio),
        importe: avanzado
          ? Number(precio) * Number(usuarios)
          : Number(precio) * Number(usuariosSeleccionados),
      };

      try {
        const resp = await anadirPaqueteInv("pedidos", body);
        auth.role !== "Administrador"
          ? await actualizarRol(
              {
                role: titulo,
                paqueteAdquirido: id,
                usuarios: avanzado ? usuarios : usuariosSeleccionados,
              },
              auth.uid
            )
          : null;

        await nuevoPedido("correos/nuevo-pedido", correoPedido);
        await nuevoPedidoAdmin("correos/nuevo-pedido-admin", correoPedidoAdmin);

        if (resp.ok) {
          toast.success(resp.msg);
          ocultarPago();
          router.push("/perfil/historial-de-pagos");
        }
        if (!resp.ok) toast.error(resp.msg);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  };

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
                  <Button titulo="Contratado" btn="Disabled" />
                ) : (
                  <>
                    {auth.role === "Intermedio" ? (
                      <Button titulo="Contratar" btn="Disabled" />
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

                      {usuarios && (usuarios >= 11) &&
                          <div className="col-12 d-flex justify-content-center mt-3 mb-3">
                            <Button titulo="Pago con tarjeta" onClick={pagar} />
                            <Button
                              titulo="Transferencia bancaria"
                              onClick={pagarTransferencia}
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

                      <div className="col-12">
                        <div className="text-center mt-5">
                          {!usuariosSeleccionados.value ? (
                            <div className="d-flex justify-content-center">
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
                            <div className="d-flex justify-content-center">
                              <Button
                                titulo="Pago con tarjeta"
                                onClick={pagar}
                              />
                              <Button
                                titulo="Transferencia bancaria"
                                onClick={pagarTransferencia}
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

        <br />
        <Form onSubmit={onSubmit}>
          <div className="form-group px-4">
            <CardElement
              options={{
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
          </div>

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
