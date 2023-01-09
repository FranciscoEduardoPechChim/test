import { ChangeEvent, Dispatch, SetStateAction, useContext } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Loading from "../../../ui/loading/Loading";
import styles from "./FormDesign.module.css";
import {
  useCategories,
  useTipoPropiedad,
} from "../../../../hooks/useCategories";
import { useSets } from '../../../../hooks/useSets';
import SeleccionarLugar from "../../../ui/buscador/SeleccionarLugar";
import MapaUbicacion from "./MapaUbicacion";
import Button from "../../../ui/button/Button";
import { MapContext } from "../../../../context/map/MapContext";

// Context
import { InmuebleContext } from '../../../../context/inmuebles/InmuebleContext';

interface Props {
  handleNextStep: (step:number) => void;
  handleChange: ({
    target,
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  titulo: string;
  tipoPropiedad: string;
  setTipoPropiedad: Dispatch<SetStateAction<string>>;
  precio: number;
  comisiones: number;
  categoria: string;
  setCategoria: Dispatch<SetStateAction<string>>;
  set: string;
  setSet: Dispatch<SetStateAction<string>>;
  alias: string | null;
  setAlias: Dispatch<SetStateAction<string | null>>;
}

const FormStepOne = (props: Props) => {
  const {
    handleNextStep,
    handleChange,
    titulo,
    tipoPropiedad,
    setTipoPropiedad,
    precio,
    comisiones,
    categoria,
    setCategoria,
    set,
    setSet,
    alias,
    setAlias
  } = props;
  const access_token                = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
  const { direccion }               = useContext(MapContext);
  const { validAlias }              = useContext(InmuebleContext);
  const { categorias, cargando }    = useCategories();
  const { loading, propertyTypes }  = useTipoPropiedad();
  const { loadingSet, sets }        = useSets();

  const longitudTitulo = titulo.length;

  const isValidAlias                = async (value: string) => {
    if(value && access_token) {
      const response                = await validAlias(value, access_token);

      return response;
    }
  }

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label className={`${styles.subTitulo}`}>
          Título del inmueble 
        </Form.Label>
        <Form.Control
          type      = "text"
          value     = {titulo}
          name      = "titulo"
          minLength = {15}
          maxLength = {100}
          required
          onChange  = {handleChange}
        />
        <Row>
          <Col>
            <Form.Text className="text-muted">
              Ej. Casa en venta en Palmaris, Cancún
            </Form.Text>
          </Col>
          <Col className="d-flex justify-content-end">
            <span
              style={{
                color: longitudTitulo > 100 ? "red" : "black",
              }}
            >
              {longitudTitulo}
            </span>
            /100
          </Col>
        </Row>
      </Form.Group>

      <Row>
        <Col md={6}>
          <div className="row mb-3">
            <div className="col-sm-5 col-md-4 col-lg-6">
              <div className={styles.content}>Tipo de inmueble</div>
            </div>
            <div className="col-sm-7 col-md-8 col-lg-6">
              {loading ? (
                <Loading />
              ) : (
                <Form.Select
                  value={tipoPropiedad}
                  onChange={(e) => setTipoPropiedad(e.target.value)}
                >
                  {propertyTypes.map((propertyType) => (
                    <option key={propertyType._id} value={propertyType._id}>
                      {propertyType.nombre}
                    </option>
                  ))}
                </Form.Select>
              )}
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="row mb-3">
            <div className="col-sm-5 col-md-4 col-lg-6">
              <div className={styles.content}>Tipo de operación</div>
            </div>
            <div className="col-sm-7 col-md-8 col-lg-6">
              {cargando ? (
                <Loading />
              ) : (
                <Form.Select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  {categorias.map((categoria) => (
                    <option key={categoria._id} value={categoria._id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </Form.Select>
              )}
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <div className="row mb-3">
            <div className="col-sm-5 col-md-4 col-lg-6">
              <div className={styles.content}>Tipo de conjunto</div>
            </div>
            <div className="col-sm-7 col-md-8 col-lg-6">
              {loadingSet ? (
                <Loading />
              ) : (
                <Form.Select
                  value     = {set}
                  onChange  = {(e:any) => setSet(e.target.value)}
                >
                  {sets.map((set:any) => (
                    <option key={set._id} value={set._id}>
                      {set.nombre}
                    </option>
                  ))}
                </Form.Select>
              )}
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="row mb-3">
            <div className="col-sm-5 col-md-4 col-lg-6">
              <div className={styles.content}>Identificador</div>
            </div>
            <div className="col-sm-7 col-md-8 col-lg-6">
              <Form.Control 
                defaultValue  = {(alias) ? alias:''} 
                id            = "alias" 
                type          = "text" 
                name          = "alias" 
                maxLength     = {255} 
                placeholder   = "House One"
                onChange      = {(e:any) => setAlias(e.target.value)}
                onBlur        = {(e:any) => isValidAlias(e.target.value)}
              />
            </div>
          </div>
        </Col>
      </Row>

      <div className={styles.MiniSub}>Ubicación</div>
      <div className={styles.line}></div>
      <br />
      <div className="row">
        <div className="col-12 mb-3">
          <SeleccionarLugar /> 
        </div>
        <div className="col-12 mb-5">
          <MapaUbicacion />
        </div>
        <div className="col-sm-12 col-md-6 col-xxl-6">
          <div className="row d-flex justify-content-start">
            <div className="col-sm-12 col-xxl-3">
              <div className={styles.labels2}>Valor</div>
            </div>
            <div className="col-sm-12 col-xxl-7">
              <div className="input-group mb-3">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="5,000.00"
                  value={precio}
                  name="precio"
                  onChange={handleChange}
                  min={0}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-md-6 col-xxl-6">
          <div className="row d-flex justify-content-end">
            <div className="col-sm-12 col-xxl-5">
              <div className={styles.labels2}>Comisiones</div>
            </div>
            <div className="col-sm-12 col-xxl-5">
              <div className="input-group mb-3">
                <span className="input-group-text">%</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="5"
                  value={comisiones}
                  name="comisiones"
                  onChange={handleChange}
                  min={0}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 my-4">
          {titulo.length === 0 || precio <= 0 || !direccion ? (
            <Button 
              titulo  = "Siguiente" 
              btn     = "Disabled" 
              style   = {{ width: 160, height: 60}}
            />
          ) : (
            <Button 
              titulo  = "Siguiente" 
              onClick = {() => handleNextStep(2)} 
              style   = {{ width: 160, height: 60}}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default FormStepOne;
