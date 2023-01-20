import { ChangeEvent } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import Loading from "../../../ui/loading/Loading";
import styles from "./FormDesign.module.css";
import Button from "../../../ui/button/Button";

const options = [
  { value: false, label: "No" },
  { value: true, label: "Sí" },
];

interface Props {
  handleNextStep: (step:number) => void;
  handlePrevStep: (step:number) => void;
  handleChange: ({
    target,
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  antiguedad: string;
  m2Construidos: number;
  m2Terreno: number;
  habitaciones: number;
  baños: number;
  medioBaños: number;
  parking: number;
  pisos: number;
  descripcion: string;
  otros: string;
  amueblado: any;
  setAmueblado: any;
  agua: any;
  luz: any;
  gas: any;
  internet: any;
  seguridadPrivada: any;
  escuelas: any;
  mantenimiento: any;
  piscina: any;
  discapacitados: any;
  camas: any;
  closet: any;
  sala: any;
  comedor: any;
  cocina: any;
  AA: any;
  refrigerador: any;
  estufa: any;
  microondas: any;
  minihorno: any;
  horno: any;
  lavadora: any;
  secadora: any;
  setAgua: any;
  setLuz: any;
  setGas: any;
  setInternet: any;
  setSeguridadPrivada: any;
  setEscuelas: any;
  setMantenimiento: any;
  setPiscina: any;
  setDiscapacitados: any;
  setCamas: any;
  setCloset: any;
  setSala: any;
  setComedor: any;
  setCocina: any;
  setAA: any;
  setRefrigerador: any;
  setEstufa: any;
  setMicroondas: any;
  setMinihorno: any;
  setHorno: any;
  setLavadora: any;
  setSecadora: any;
  cargando: boolean;
  action: string,
}

const Formulario = (props: Props) => {
  const {
    antiguedad,
    m2Construidos,
    m2Terreno,
    habitaciones,
    baños,
    medioBaños,
    parking,
    pisos,
    descripcion,
    otros,
    handleChange,
    amueblado,
    setAmueblado,
    agua,
    luz,
    gas,
    internet,
    seguridadPrivada,
    escuelas,
    mantenimiento,
    piscina,
    discapacitados,
    camas,
    closet,
    sala,
    comedor,
    cocina,
    AA,
    refrigerador,
    estufa,
    microondas,
    minihorno,
    horno,
    lavadora,
    secadora,
    setAgua,
    setLuz,
    setGas,
    setInternet,
    setSeguridadPrivada,
    setEscuelas,
    setMantenimiento,
    setPiscina,
    setDiscapacitados,
    setCamas,
    setCloset,
    setSala,
    setComedor,
    setCocina,
    setAA,
    setRefrigerador,
    setEstufa,
    setMicroondas,
    setMinihorno,
    setHorno,
    setLavadora,
    setSecadora,
    cargando,
    action,
    handlePrevStep,
    handleNextStep
  } = props;

  const longitudOtros = otros.length;

  return (
    <>
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-12 px-4">
          <hr />
          <div className={styles.MiniSub}>Detalles del inmueble</div>
          <div className={styles.line}></div>
          <br />

          <div className="row">
            <div className="col-6 mb-3">
              <div className="row">
                <div className="col-sm-12 col-md-8 col-lg-7 col-xl-7 col-xxl-8">
                  <div className={styles.labels}>Antigüedad</div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-5 col-xl-5 col-xxl-4">
                  <Form.Control
                    value={antiguedad}
                    name="antiguedad"
                    onChange={handleChange}
                    type="text"
                    placeholder="Ej: 5 años"
                  />
                </div>
              </div>
            </div>
            <div className="col-6 mb-3">
              <div className="row">
                <div className="col-sm-12 col-md-8 col-lg-7 col-xl-7 col-xxl-8">
                  <div className={styles.labels}>M² de construcción</div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-5 col-xl-5 col-xxl-4">
                  <Form.Control
                    value={m2Construidos}
                    name="m2Construidos"
                    onChange={handleChange}
                    type="number"
                    min={0}
                  />
                </div>
              </div>
            </div>
            <div className="col-6 mb-3">
              <div className="row">
                <div className="col-sm-12 col-md-8 col-lg-7 col-xl-7 col-xxl-8">
                  <div className={styles.labels}>M² de terreno</div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-5 col-xl-5 col-xxl-4">
                  <Form.Control
                    value={m2Terreno}
                    name="m2Terreno"
                    onChange={handleChange}
                    type="number"
                    min={0}
                  />
                </div>
              </div>
            </div>
            <div className="col-6 mb-3">
              <div className="row">
                <div className="col-sm-12 col-md-8 col-lg-7 col-xl-7 col-xxl-8">
                  <div className={styles.labels}>Habitaciones</div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-5 col-xl-5 col-xxl-4">
                  <Form.Control
                    value={habitaciones}
                    name="habitaciones"
                    onChange={handleChange}
                    type="number"
                    min={0}
                  />
                </div>
              </div>
            </div>
            <div className="col-6 mb-3">
              <div className="row">
                <div className="col-sm-12 col-md-8 col-lg-7 col-xl-7 col-xxl-8">
                  <div className={styles.labels}>Baños completos</div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-5 col-xl-5 col-xxl-4">
                  <Form.Control
                    value={baños}
                    name="baños"
                    onChange={handleChange}
                    type="number"
                    min={0}
                  />
                </div>
              </div>
            </div>
            <div className="col-6 mb-3">
              <div className="row">
                <div className="col-sm-12 col-md-8 col-lg-7 col-xl-7 col-xxl-8">
                  <div className={styles.labels}>Medios baños</div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-5 col-xl-5 col-xxl-4">
                  <Form.Control
                    value={medioBaños}
                    name="medioBaños"
                    onChange={handleChange}
                    type="number"
                    min={0}
                  />
                </div>
              </div>
            </div>
            <div className="col-6 mb-3">
              <div className="row">
                <div className="col-sm-12 col-md-8 col-lg-7 col-xl-7 col-xxl-8">
                  <div className={styles.labels}>Estacionamientos</div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-5 col-xl-5 col-xxl-4">
                  <Form.Control
                    value={parking}
                    name="parking"
                    onChange={handleChange}
                    type="number"
                    min={0}
                  />
                </div>
              </div>
            </div>
            <div className="col-6 mb-3">
              <div className="row">
                <div className="col-sm-12 col-md-8 col-lg-7 col-xl-7 col-xxl-8">
                  <div className={styles.labels}>Pisos</div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-5 col-xl-5 col-xxl-4">
                  <Form.Control
                    value={pisos}
                    name="pisos"
                    onChange={handleChange}
                    type="number"
                    min={0}
                  />
                </div>
              </div>
            </div>
            <div className="col-6 mb-3">
              <div className="row">
                <div className="col-sm-12 col-md-8 col-lg-7 col-xl-7 col-xxl-8">
                  <div className={styles.labels}>Cuenta con agua</div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-5 col-xl-5 col-xxl-4">
                  <Select
                    options       = {options}
                    defaultValue  = {agua}
                    onChange      = {setAgua}
                    placeholder   = {(action == 'create') ? '':(agua ? "Sí":"No")}
                  />
                </div>
              </div>
            </div>
            <div className="col-6 mb-3">
              <div className="row">
                <div className="col-sm-12 col-md-8 col-lg-7 col-xl-7 col-xxl-8">
                  <div className={styles.labels}>Cuenta con luz</div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-5 col-xl-5 col-xxl-4">
                  <Select
                    options       = {options}
                    defaultValue  = {luz}
                    onChange      = {setLuz}
                    placeholder   = {(action == 'create') ? '':(luz ? "Sí":"No")}
                  />
                </div>
              </div>
            </div>
            <div className="col-6 mb-3">
              <div className="row">
                <div className="col-sm-12 col-md-8 col-lg-7 col-xl-7 col-xxl-8">
                  <div className={styles.labels}>Cuenta con gas</div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-5 col-xl-5 col-xxl-4">
                  <Select
                    options       = {options}
                    defaultValue  = {gas}
                    onChange      = {setGas}
                    placeholder   = {(action == 'create') ? '':(gas ? "Sí":"No")}
                  />
                </div>
              </div>
            </div>
            <div className="col-6 mb-3">
              <div className="row">
                <div className="col-sm-12 col-md-8 col-lg-7 col-xl-7 col-xxl-8">
                  <div className={styles.labels}>Internet</div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-5 col-xl-5 col-xxl-4">
                  <Select
                    options         = {options}
                    defaultValue    = {internet}
                    onChange        = {setInternet}
                    placeholder     = {(action == 'create') ? '':(internet ? "Sí":"No")}
                  />
                </div>
              </div>
            </div>
            <div className="col-6 mb-3">
              <div className="row">
                <div className="col-sm-12 col-md-8 col-lg-7 col-xl-7 col-xxl-8">
                  <div className={styles.labels}>Seguridad privada</div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-5 col-xl-5 col-xxl-4">
                  <Select
                    options         = {options}
                    defaultValue    = {seguridadPrivada}
                    onChange        = {setSeguridadPrivada}
                    placeholder     = {(action == 'create') ? '':(seguridadPrivada ? "Sí":"No")}
                  />
                </div>
              </div>
            </div>
            <div className="col-6 mb-3">
              <div className="row">
                <div className="col-sm-12 col-md-8 col-lg-7 col-xl-7 col-xxl-8">
                  <div className={styles.labels}>Escuelas cercanas</div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-5 col-xl-5 col-xxl-4">
                  <Select
                    options       = {options}
                    defaultValue  = {escuelas}
                    onChange      = {setEscuelas}
                    placeholder   = {(action == 'create') ? '':(escuelas ? "Sí":"No")}
                  />
                </div>
              </div>
            </div>
            <div className="col-6 mb-3">
              <div className="row">
                <div className="col-sm-12 col-md-8 col-lg-7 col-xl-7 col-xxl-8">
                  <div className={styles.labels}>Mantenimiento</div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-5 col-xl-5 col-xxl-4">
                  <Select
                    options       = {options}
                    defaultValue  = {mantenimiento}
                    onChange      = {setMantenimiento}
                    placeholder   = {(action == 'create') ? '':(mantenimiento ? "Sí":"No")}
                  />
                </div>
              </div>
            </div>
            <div className="col-6 mb-3">
              <div className="row">
                <div className="col-sm-12 col-md-8 col-lg-7 col-xl-7 col-xxl-8">
                  <div className={styles.labels}>Alberca</div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-5 col-xl-5 col-xxl-4">
                  <Select
                    options       = {options}
                    defaultValue  = {piscina}
                    onChange      = {setPiscina}
                    placeholder   = {(action == 'create') ? '':(piscina ? "Sí":"No")}
                  />
                </div>
              </div>
            </div>
            <div className="col-6 mb-3">
              <div className="row">
                <div className="col-sm-12 col-md-8 col-lg-7 col-xl-7 col-xxl-8">
                  <div className={styles.labels}>Acceso a discapacitados</div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-5 col-xl-5 col-xxl-4">
                  <Select
                    options         = {options}
                    defaultValue    = {discapacitados}
                    onChange        = {setDiscapacitados}
                    placeholder     = {(action == 'create') ? '':(discapacitados ? "Sí":"No")}
                  />
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className={styles.MiniSub}>¿El inmueble está amueblado?</div>
          <div className={styles.line}></div>
          <br />
          <div className="row">
            <div className="col-12 mb-3">
              <Form.Check
                inline
                type            = "radio"
                name            = "group2"
                label           = "Sí"
                defaultChecked  = {amueblado}
                onClick         = {() => {
                  setAmueblado(true);
                }}
              />
              <Form.Check
                inline
                type            = "radio"
                name            = "group2"
                label           = "No"
                defaultChecked  = {!amueblado}
                onClick         = {() => {
                  setAmueblado(false);
                }}
              />
            </div>
            {amueblado ? (
              <>
                <div className="col-6 mb-3">
                  <div className="row">
                    <div className="col-sm-12 col-md-7 col-lg-6 col-xxl-7">
                      <div className={styles.labels}>Camas</div>
                    </div>
                    <div className="col-sm-12 col-md-4 col-lg-6 col-xxl-4">
                      <Select
                        options       = {options}
                        defaultValue  = {camas}
                        onChange      = {setCamas}
                        placeholder   = {(action == 'create') ? '':(camas ? "Sí":"No")}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="row">
                    <div className="col-sm-12 col-md-7 col-lg-6 col-xxl-7">
                      <div className={styles.labels}>Closet</div>
                    </div>
                    <div className="col-sm-12 col-md-4 col-lg-6 col-xxl-4">
                      <Select
                        options         = {options}
                        defaultValue    = {closet}
                        onChange        = {setCloset}
                        placeholder     = {(action == 'create') ? '':(closet ? "Sí":"No")}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="row">
                    <div className="col-sm-12 col-md-7 col-lg-6 col-xxl-7">
                      <div className={styles.labels}>Sala</div>
                    </div>
                    <div className="col-sm-12 col-md-4 col-lg-6 col-xxl-4">
                      <Select
                        options         = {options}
                        defaultValue    = {sala}
                        onChange        = {setSala}
                        placeholder     = {(action == 'create') ? '':(sala ? "Sí":"No")}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="row">
                    <div className="col-sm-12 col-md-7 col-lg-6 col-xxl-7">
                      <div className={styles.labels}>Comedor</div>
                    </div>
                    <div className="col-sm-12 col-md-4 col-lg-6 col-xxl-4">
                      <Select
                        options       = {options}
                        defaultValue  = {comedor}
                        onChange      = {setComedor}
                        placeholder   = {(action == 'create') ? '':(comedor ? "Sí":"No")}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="row">
                    <div className="col-sm-12 col-md-7 col-lg-6 col-xxl-7">
                      <div className={styles.labels}>Cocina</div>
                    </div>
                    <div className="col-sm-12 col-md-4 col-lg-6 col-xxl-4">
                      <Select
                        options       = {options}
                        defaultValue  = {cocina}
                        onChange      = {setCocina}
                        placeholder   = {(action == 'create') ? '':(cocina ? "Sí":"No")}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="row">
                    <div className="col-sm-12 col-md-7 col-lg-6 col-xxl-7">
                      <div className={styles.labels}>AA</div>
                    </div>
                    <div className="col-sm-12 col-md-4 col-lg-6 col-xxl-4">
                      <Select
                        options       = {options}
                        defaultValue  = {AA}
                        onChange      = {setAA}
                        placeholder   = {(action == 'create') ? '':(AA ? "Sí":"No")}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="row">
                    <div className="col-sm-12 col-md-7 col-lg-6 col-xxl-7">
                      <div className={styles.labels}>Refrigerador</div>
                    </div>
                    <div className="col-sm-12 col-md-4 col-lg-6 col-xxl-4">
                      <Select
                        options       = {options}
                        defaultValue  = {refrigerador}
                        onChange      = {setRefrigerador}
                        placeholder   = {(action == 'create') ? '':(refrigerador ? "Sí":"No")}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="row">
                    <div className="col-sm-12 col-md-7 col-lg-6 col-xxl-7">
                      <div className={styles.labels}>Estufa</div>
                    </div>
                    <div className="col-sm-12 col-md-4 col-lg-6 col-xxl-4">
                      <Select
                        options       = {options}
                        defaultValue  = {estufa}
                        onChange      = {setEstufa}
                        placeholder   = {(action == 'create') ? '':(estufa ? "Sí":"No")}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="row">
                    <div className="col-sm-12 col-md-7 col-lg-6 col-xxl-7">
                      <div className={styles.labels}>Microondas</div>
                    </div>
                    <div className="col-sm-12 col-md-4 col-lg-6 col-xxl-4">
                      <Select
                        options       = {options}
                        defaultValue  = {microondas}
                        onChange      = {setMicroondas}
                        placeholder   = {(action == 'create') ? '':(microondas ? "Sí":"No")}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="row">
                    <div className="col-sm-12 col-md-7 col-lg-6 col-xxl-7">
                      <div className={styles.labels}>Mini horno</div>
                    </div>
                    <div className="col-sm-12 col-md-4 col-lg-6 col-xxl-4">
                      <Select
                        options       = {options}
                        defaultValue  = {minihorno}
                        onChange      = {setMinihorno}
                        placeholder   = {(action == 'create') ? '':(minihorno ? "Sí":"No")}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="row">
                    <div className="col-sm-12 col-md-7 col-lg-6 col-xxl-7">
                      <div className={styles.labels}>Horno</div>
                    </div>
                    <div className="col-sm-12 col-md-4 col-lg-6 col-xxl-4">
                      <Select
                        options       = {options}
                        defaultValue  = {horno}
                        onChange      = {setHorno}
                        placeholder   = {(action == 'create') ? '':(horno ? "Sí":"No")}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="row">
                    <div className="col-sm-12 col-md-7 col-lg-6 col-xxl-7">
                      <div className={styles.labels}>Lavadora</div>
                    </div>
                    <div className="col-sm-12 col-md-4 col-lg-6 col-xxl-4">
                      <Select
                        options       = {options}
                        defaultValue  = {lavadora}
                        onChange      = {setLavadora}
                        placeholder   = {(action == 'create') ? '':(lavadora ? "Sí":"No")}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="row">
                    <div className="col-sm-12 col-md-7 col-lg-6 col-xxl-7">
                      <div className={styles.labels}>Secadora</div>
                    </div>
                    <div className="col-sm-12 col-md-4 col-lg-6 col-xxl-4">
                      <Select
                        options       = {options}
                        defaultValue  = {secadora}
                        onChange      = {setSecadora}
                        placeholder   = {(action == 'create') ? '':(secadora ? "Sí":"No")}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12 mb-3">
                  <div className="row">
                    <div className="col-3">
                      <div className={styles.labels}>Otros (opcional):</div>
                    </div>
                    <div className="col-9">
                      <Form.Control
                        type="text"
                        value={otros}
                        onChange={handleChange}
                        name="otros"
                      />
                      <Row>
                        <Col />
                        <Col className="d-flex justify-content-end">
                          <span
                            style={{
                              color: longitudOtros > 100 ? "red" : "black",
                            }}
                          >
                            {longitudOtros}
                          </span>
                          /100
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
          <hr />
          <div className={styles.MiniSub}>Descripción del inmueble</div>
          <div className={styles.line}></div>
          <br />
          <div className="row">
            <div className="col-12 mb-3 ">
              <Form.Control
                as          = "textarea"
                rows        = {7}
                value       = {descripcion}
                name        = "descripcion"
                maxLength   = {255}
                style       = {{ resize: 'none' }}
                onChange    = {handleChange}
                placeholder = "Escribe una breve descripción del inmueble..."
              />
              <div className="d-flex justify-content-center py-4">
                {cargando ? <Loading /> : null}
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 my-3">
          {cargando ? (
            <Button 
              titulo  = "Anterior"
              btn     = "Disabled"
              style   = {{ width: 135, height: 60}}
            />
          ) : (
            <Button 
              titulo  = "Anterior" 
              onClick = {() => handlePrevStep(1)} 
              style   = {{ width: 135, height: 60}}
            />
          )}
          <span className="mx-2" />
          {(cargando) ? (
            <Button
              titulo  = "Siguiente"
              btn     = "Disabled"
              style   = {{ width: 135, height: 60}}
            />
          ) : (
            (descripcion != '') ? 
            <Button 
              titulo  = "Siguiente" 
              onClick = {() => handleNextStep(3)} 
              style   = {{ width: 135, height: 60}}
            />:
            <Button 
              titulo  = "Siguiente" 
              btn     = "Disabled" 
              style   = {{ width: 135, height: 60}}
            />
          )}
        </div>
      </div>
    </>
  );
};
 
export default Formulario;
