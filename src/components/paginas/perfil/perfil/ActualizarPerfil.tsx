import Modaltitle2 from "components/ui/modaltitle/Modaltitle2";
import { ChangeEvent, FormEvent, useContext, useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Col, Container, Form, Row, Modal } from "react-bootstrap";
import RangeSlider from 'react-bootstrap-range-slider';
import Geosuggest, { Suggest } from "react-geosuggest";
import { toast } from "react-toastify";
import { AuthContext } from "../../../../context/auth/AuthContext";
import { useForm } from "../../../../hooks/useForm";
import Button from "../../../ui/button/Button";
import Modaltitle from "../../../ui/modaltitle/Modaltitle";
import Titulo from "../../../ui/titulo/Titulo";
import styles from "./Perfil.module.css";
import Card from '@material-ui/core/Card';
 
//Material UI
import { Tooltip } from "@material-ui/core";
//Middlewares
import { isUserByPay } from "middlewares/roles";
//Hooks
import { useCategories, useTipoPropiedad } from '../../../../hooks/useCategories';
import { useLocationByEmail } from '../../../../hooks/useLocationByEmail';
import { useSets } from '../../../../hooks/useSets';
//Components
import BarraCategorias from '../../../paginas/inicio/BarraCategorias';
import Loading from "components/ui/loading/Loading";
//Credentials
import { rentas, casasC } from '../../../../credentials/credentials';
//Helpers
import { isString, isNotEmpty, isInteger } from "helpers/validations";

interface Props {
  auth:               any,
  locationEmailArray: any, 
  setArray:           any, 
  priceArray:         any, 
  groundArray:        any, 
  buildArray:         any, 
  rangeArray:         any, 
  bathsArray:         any, 
  garagesArray:       any, 
  roomsArray:         any, 
  categoryArray:      any, 
  typeArray:          any
}

const ActualizarPerfilForm                          = ({auth, locationEmailArray, setArray, priceArray, groundArray, buildArray, rangeArray, bathsArray, garagesArray, roomsArray, categoryArray, typeArray}:Props) => {
  const access_token                                = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
  const { editProfile }                             = useContext(AuthContext);
  const router                                      = useRouter();
  const [checkboxEmail, setCheckboxEmail]           = useState((auth.recibirCorreo) ? auth.recibirCorreo:false);
  const [location, setLocation]                     = useState((auth.direccionFisica && String(auth.lat) && String(auth.lng)) ? {label: auth.direccionFisica, location: {lat: auth.lat, lng: auth.lng}}:null);
  const [showLocationEmail, setShowLocationEmail]   = useState(false);
  const [index, setIndex]                           = useState(0);
  const [showFilter, setShowFilter]                 = useState(false);
  const [locationEmail, setLocationEmail]           = useState<any>((locationEmailArray.length != 0) ? locationEmailArray:[{label: '', location: { lat: 0, lng: 0}}]);
  const geosuggestEl                                = useRef<Geosuggest>(null);
  const [set, setSet]                               = useState((setArray.length != 0) ? setArray:['all']);
  const [price, setPrice]                           = useState((priceArray.length != 0) ? priceArray:[{min: 0, max: 10000000}]);
  const [ground, setGround]                         = useState((groundArray.length != 0) ? groundArray:[{min: 0, max: 10000}]);
  const [build, setBuild]                           = useState((buildArray.length) ? buildArray:[{min: 0, max: 10000}]);
  const [range, setRange]                           = useState((rangeArray.length != 0) ? rangeArray:[50]);
  const [bath, setBath]                             = useState((bathsArray.length != 0) ? bathsArray:[0]);
  const [garage, setGarage]                         = useState((garagesArray.length != 0) ? garagesArray:[0]);
  const [room, setRoom]                             = useState((roomsArray.length != 0) ? roomsArray:[0]);
  const [category, setCategory]                     = useState((categoryArray.length != 0) ? categoryArray:[rentas]);
  const [type, setType]                             = useState((typeArray.length != 0) ? typeArray:[casasC]);
  const [quantity, setQuantity]                     = useState([0,1,2,3,4]);
  const [rangeTemp, setRangeTemp]                   = useState(false);
  const [errorName, setErrorName]                   = useState([]);
  const [errorLastName, setErrorLastName]           = useState([]);
  const [errorPhone, setErrorPhone]                 = useState([]);
  const [errorOfficePhone, setErrorOfficePhone]     = useState([]);
  const [errorLocation, setErrorLocation]           = useState([]);
  const { loading, propertyTypes, 
    obtenerTipoPropiedad }                          = useTipoPropiedad();
  const { cargando, categorias, obtenerCategorias } = useCategories();
  const { loadingSet, sets, init }                  = useSets();
 
  const INITIAL_STATE                               = {
    name:                                           (auth && auth.nombre) ? auth.nombre:'',
    lastName:                                       (auth && auth.apellido) ? auth.apellido:'',
    companyProfile:                                 (auth && auth.perfilEmpresarial) ? auth.perfilEmpresarial:'',
    phoneOffice:                                    (auth && auth.telefonoOficina) ? auth.telefonoOficina:0,
    phone:                                          (auth && auth.telefonoPersonal) ? auth.telefonoPersonal:0,
    companyName:                                    (auth && auth.nombreInmobiliaria) ? auth.nombreInmobiliaria:'',
    companyLocation:                                (auth && auth.direccionFisica) ? auth.direccionFisica:'',
    website:                                        (auth && auth.sitioweb) ? auth.sitioweb:'', 
    facebook:                                       (auth && auth.facebookpage) ? auth.facebookpage:'',
    instagram:                                      (auth && auth.instagram) ? auth.instagram:'',
    twitter:                                        (auth && auth.twitter) ? auth.twitter:'',
    youtube:                                        (auth && auth.youtube) ? auth.youtube:'',
    linkedin:                                       (auth && auth.linkedin) ? auth.linkedin:''
  }

  const { formulario, handleChange }                = useForm(INITIAL_STATE);
  const { name, lastName, companyProfile, 
    phoneOffice, phone, companyName, 
    companyLocation, website, facebook, 
    instagram, twitter, youtube, linkedin }         = formulario;

  const onSuggestSelect                             = (suggest: Suggest) => {
    setLocation((suggest) ? {label: suggest.label, location: suggest.location }:null);
  }

  const handleCheckbox                              = async () => {
    setCheckboxEmail(!checkboxEmail);
    setShowLocationEmail(!showLocationEmail);
  }

  const handleSelect                                = async (suggest: Suggest) => {
    for(let i=0; i < locationEmail.length; i++) {
      if(locationEmail[i].label == '') {
        locationEmail[i]                            = (suggest) ? {label: suggest.label, location: suggest.location }:null;
        setLocationEmail(locationEmail);
      }
    }
  }

  const handleClose                                 = async (key: number) => {
  
    const locationArray                             = locationEmail.filter((item:any, i: number) => {
      if((i != key) && (item.label != '')) {
        return item;
      }
    });

    set.splice(key, 1);
    price.splice(key, 1);
    ground.splice(key, 1);
    build.splice(key, 1);
    range.splice(key, 1);
    bath.splice(key, 1);
    garage.splice(key, 1);
    room.splice(key, 1);
    category.splice(key, 1);
    type.splice(key, 1);

    setSet(set);
    setPrice(price);
    setGround(ground);
    setBuild(build);
    setRange(range);
    setBath(bath);
    setGarage(garage);
    setRoom(room);
    setCategory(category);
    setType(type);
    setIndex(0);
    setLocationEmail(locationArray);
  }

  const modalClose                                  = () => {
    setErrorName([]); setErrorLastName([]); setErrorPhone([]); setErrorOfficePhone([]); setErrorLocation([]);
    setShowFilter(false);
  }

  const handleAddLocation                           = async () => {
    
    const locationArray                             = locationEmail.filter((item:any) => {
      if(item.label != '') {
        return item;
      }
    });

    set[locationArray.length]                       = 'all';
    price[locationArray.length]                     = {min: 0, max: 10000000};
    ground[locationArray.length]                    = {min: 0, max: 10000};
    build[locationArray.length]                     = {min: 0, max: 10000};
    range[locationArray.length]                     = 50;
    bath[locationArray.length]                      = 0;
    garage[locationArray.length]                    = 0;
    room[locationArray.length]                      = 0;
    category[locationArray.length]                  = rentas;
    type[locationArray.length]                      = casasC;

    locationArray.push({ label: '', location: { lat: 0, lng: 0}});

    setSet(set);
    setPrice(price);
    setGround(ground);
    setBuild(build);
    setRange(range);
    setBath(bath);
    setGarage(garage);
    setRoom(room);
    setCategory(category);
    setType(type);
    setLocationEmail(locationArray);
  }

  const handleClick                                 = async (item: string, select: string) => {
    if(item && select) {
      switch(select) {
        case 'category':
          category[index]                           = item;
          setCategory(category);
          obtenerCategorias();
        break;
        case 'type':
          type[index]                               = item;
          setType(type);
          obtenerTipoPropiedad();
        break;
        case 'room':
          room[index]                               = Number(item);
          setRoom(room);
          setQuantity([0,1,2,3,4]);
        break;
        case 'baths':
          bath[index]                              = Number(item);
          setBath(bath);
          setQuantity([0,1,2,3,4]);
        break;
        case 'garages':
          garage[index]                            = Number(item);
          setGarage(garage);
          setQuantity([0,1,2,3,4]);
        break;
        case 'set':
          set[index]                               = item;
          setSet(set);
          init();
        break;
      }
    }
  }

  const handleInput                                 = async (item: number, select: string) => {
    if(String(item) && select) {
      switch(select) {
        case 'min_price':
          price[index].min                          = item;
          setPrice(price);
        break;
        case 'max_price':
          price[index].max                          = item;
          setPrice(price);
        break;
        case 'min_ground':
          ground[index].min                         = item;
          setGround(ground);
        break;
        case 'max_ground':
          ground[index].max                         = item;
          setGround(ground);
        break;
        case 'min_build':
          build[index].min                          = item;
          setBuild(build);
        break;
        case 'max_build':
          build[index].max                          = item;
          setBuild(build);
        break;
        case 'range': 
          range[index]                              = item;
          setRange(range);
          setRangeTemp(!rangeTemp);
        break;
      }
    }
  }

  const handleFilter                                = async (key: number) => {
    setIndex(key);
    setShowFilter(true);
  }

  const formValidate                                = (name: string, message: any) => {

    const messageError                              = message.filter((value:any) => value != '');

    if(messageError.length == 0) {
      return false;
    }

    switch(name) {
      case 'name':
        setErrorName(messageError);
      return true;
      case 'lastName':
        setErrorLastName(messageError);
      return true;
      case 'phone':
        setErrorPhone(messageError);
      return true;
      case 'officePhone':
        setErrorOfficePhone(messageError);
      return true;
      case 'location':
        setErrorLocation(messageError);
      return true;
      default:
      return true;
    }
  }

  const onSubmit                                    = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorName([]); setErrorLastName([]); setErrorPhone([]); setErrorOfficePhone([]); setErrorLocation([]);

    const formName                                  = formValidate('name', [isNotEmpty(formulario.name), isString(formulario.name)]);
    const formLastName                              = formValidate('lastName', [isNotEmpty(formulario.lastName), isString(formulario.lastName)]);
    const formPhone                                 = formValidate('phone', [isInteger(formulario.phone)]);
    const formOfficePhone                           = formValidate('OfficePhone', [isInteger(formulario.phoneOffice)]);
    const formLocation                              = formValidate('location', [isNotEmpty((location) ? location.label:''), isString((location) ? location.label:'')]);

    if(formName || formLastName || formPhone || formOfficePhone || formLocation) {
        return false;
    }

    const result:any                                = [];

    const locations                                 = locationEmail.filter((item:any, key: number) => {
      if(item.label != '') {
        return item;
      }else {
        result.push(key);
      }
    });

    if(checkboxEmail) {
      const quantity                                = locations.length;

      if((quantity != range.length) || (quantity != set.length) || (quantity != price.length) || (quantity != ground.length) || 
        (quantity != build.length) || (quantity != bath.length) || (quantity != garage.length) || (quantity != room.length) ||
        (quantity != category.length) || (quantity != type.length)) {
          toast.error('Error en zonas');
          return false;
      }
    }

    const nameLocation                              = locations.map((item:any) => {
      return item.label;
    });

    const latLocation                               = locations.map((item:any) => {
      return String(item.location.lat);
    });

    const lngLocation                               = locations.map((item:any) => {
      return String(item.location.lng);
    });

    const rangeLocation                             = range.filter((item:any, key: number) => {
      if(!result.includes(key)) {
        return String(item);
      }
    });

    const bathLocation                              = bath.filter((item:any, key: number) => {
      if(!result.includes(key)) {
        return String(item);
      }
    });

    const setLocation                               = set.filter((item:any, key: number) => {
      if(!result.includes(key)) {
        return item;
      }
    });

    const minPriceLocation                          = [];
    const maxPriceLocation                          = [];

    for(let i=0; i < price.length; i++) {
      if(!result.includes(i)) {
        minPriceLocation.push(price[i].min);
        maxPriceLocation.push(price[i].max);
      }
    }

    const minGroundLocation                         = [];
    const maxGroundLocation                         = [];

    for(let i=0; i < ground.length; i++) {
      if(!result.includes(i)) {
        minGroundLocation.push(ground[i].min);
        maxGroundLocation.push(ground[i].max);
      }
    }
    
    const minBuildLocation                          = [];
    const maxBuildLocation                          = [];

    for(let i=0; i < build.length; i++) {
      if(!result.includes(i)) {
        minBuildLocation.push(build[i].min);
        maxBuildLocation.push(build[i].max);
      }
    }

    const garageLocation                            = garage.filter((item:any, key: number) => {
      if(!result.includes(key)) {
        return String(item);
      }
    });

    const roomLocation                              = room.filter((item:any, key: number) => {
      if(!result.includes(key)) {
        return String(item);
      }
    });
 
    const categoryLocation                          = category.filter((item:any, key: number) => {
      if(!result.includes(key)) {
        return item;
      }
    });

    const typeLocation                              = type.filter((item:any, key: number) => {
      if(!result.includes(key)) {
        return item;
      }
    });

    const isValid                                   = await editProfile((auth && auth.uid) ? auth.uid:'', (typeof formulario.name == 'string') ? formulario.name:'', ((typeof formulario.companyProfile == 'string') && (formulario.companyProfile != '')) ? formulario.companyProfile:null, ((typeof formulario.phone == 'number') && (formulario.phone != 0)) ? formulario.phone:null, 
                                                      ((typeof formulario.phoneOffice == 'number') && (formulario.phoneOffice != 0)) ? formulario.phoneOffice:null, (typeof formulario.lastName == 'string') ? formulario.lastName:'', ((typeof formulario.companyName == 'string') && (formulario.companyName != '')) ? formulario.companyName:null, (location) ? location.label:'', 
                                                      (location && (typeof location.location.lat == 'number')) ? location.location.lat:0, (location && (typeof location.location.lng == 'number')) ? location.location.lng:0, ((typeof formulario.website == 'string') && (formulario.website != '')) ? formulario.website:null, ((typeof formulario.facebook == 'string') && (formulario.facebook != '')) ? formulario.facebook:null,
                                                      ((typeof formulario.instagram == 'string') && (formulario.instagram != '')) ? formulario.instagram:null, ((typeof formulario.twitter == 'string') && (formulario.twitter != '')) ? formulario.twitter:null, ((typeof formulario.youtube == 'string') && (formulario.youtube != '')) ? formulario.youtube:null, 
                                                      ((typeof formulario.linkedin == 'string') && (formulario.linkedin != '')) ? formulario.linkedin:null, checkboxEmail, (checkboxEmail) ? nameLocation.join('|'):null, (checkboxEmail) ? latLocation.join(','):null, 
                                                      (checkboxEmail) ? lngLocation.join(','):null, (checkboxEmail) ? rangeLocation.join(','):null, (checkboxEmail) ? categoryLocation.join(','):null,
                                                      (checkboxEmail) ? typeLocation.join(','):null, (checkboxEmail) ? roomLocation.join(','):null, (checkboxEmail) ? bathLocation.join(','):null, 
                                                      (checkboxEmail) ? garageLocation.join(','):null, (checkboxEmail) ? minPriceLocation.join(','):null, (checkboxEmail) ? maxPriceLocation.join(','):null,
                                                      (checkboxEmail) ? minGroundLocation.join(','):null, (checkboxEmail) ? maxGroundLocation.join(','):null, (checkboxEmail) ? setLocation.join(','):null,
                                                      (checkboxEmail) ? minBuildLocation.join(','):null, (checkboxEmail) ? maxBuildLocation.join(','):null, (access_token) ? access_token:'');

    if(isValid) {
      router.push('/perfil');
    }
  }

  return (
    <Container>
      <Titulo titulo="Actualiza tu perfil" />
      <Row className="mt-5">
        <Col sm={12}>
          <Form onSubmit={onSubmit}>
            <Row >
              <Col sm={12}>
                <div className="d-flex justify-content-start">
                  <Modaltitle2 titulo="Datos personales" />
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre(s)</Form.Label>
                  <Form.Control
                    type      = "text"
                    value     = {name}
                    name      = "name"
                    onChange  = {handleChange}
                  />
                  {(errorName) && (errorName.length != 0) && errorName.map((value: any, key: any) => {
                    return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                  })}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellidos</Form.Label>
                  <Form.Control
                    type      = "text"
                    value     = {lastName}
                    name      = "lastName"
                    onChange  = {handleChange}
                  />
                  {(errorLastName) && (errorLastName.length != 0) && errorLastName.map((value: any, key: any) => {
                    return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                  })}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Perfil empresarial</Form.Label>
                  <Form.Control
                    as          = "textarea"
                    placeholder = "Descríbase"
                    value       = {companyProfile}
                    name        = "companyProfile"
                    onChange    = {handleChange}
                    rows        = {3}
                    style       = {{ resize: 'none'}}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono de oficina</Form.Label>
                  <Form.Control
                    type      = "number"
                    value     = {phoneOffice}
                    name      = "phoneOffice"
                    onChange  = {handleChange}
                  />
                  {(errorPhone) && (errorPhone.length != 0) && errorPhone.map((value: any, key: any) => {
                    return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                  })}
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono de personal</Form.Label>
                  <Form.Control
                    type      = "number"
                    value     = {phone}
                    name      = "phone"
                    onChange  = {handleChange}
                  />
                  {(errorOfficePhone) && (errorOfficePhone.length != 0) && errorOfficePhone.map((value: any, key: any) => {
                    return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                  })}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col sm={12}>
                <div className="d-flex justify-content-start">
                  <Modaltitle2 titulo="Datos de la inmobiliaria" />
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type      = "text"
                    value     = {companyName}
                    name      = "companyName"
                    onChange  = {handleChange}
                    disabled  = {isUserByPay() ? true:false}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Ubicación</Form.Label>
                  <Geosuggest
                    ref                   = {geosuggestEl}
                    initialValue          = {companyLocation}
                    value                 = {companyLocation}
                    defaultValue          = {companyLocation}
                    queryDelay            = {530}
                    country               = {["mx", "usa"]}
                    placeholder           = "Colonia centro CP 77500 Cancún QRoo"
                    onSuggestSelect       = {onSuggestSelect}
                    autoComplete          = "off"
                    inputClassName        = {styles.buscador}
                    suggestsClassName     = {styles.respuesta}
                    suggestItemClassName  = {styles.item}
                    disabled              = {isUserByPay() ? true:false}
                  />
                  {(errorLocation) && (errorLocation.length != 0) && errorLocation.map((value: any, key: any) => {
                    return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                  })}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Form.Group className="mt-2 mb-3">
                  <Form.Check
                    checked   = {checkboxEmail}
                    onChange  = {() => handleCheckbox()}
                    type      = "checkbox"
                    label     = "Quiero recibir correos electrónicos cuando haya inmuebles nuevos por zonas"
                    disabled  = {isUserByPay() ? true:false}
                  />
                </Form.Group>
              </Col>
            </Row>

            {(checkboxEmail) &&
              <Card>
                <Row className="mt-2">
                  <Col sm={12}>
                    <div className={`mx-3 my-2 d-flex justify-content-end`}>
                      <button type="button" className={`${styles.Green} pointer`} onClick={() => handleAddLocation()}>
                        <i className="bi bi-plus-lg"></i> Añadir
                      </button>
                    </div>
                  </Col>
                </Row>
                <Row className="mx-2 mb-3 mt-2">
                  <Col sm={12}>
                    <Form.Label>Zona 1</Form.Label>
                  </Col>
                  <Col xs={8} sm={10}>
                    <Form.Group className="mb-3">
                      <Geosuggest
                        ref                   = {geosuggestEl}
                        initialValue          = {locationEmail[0].label}
                        value                 = {locationEmail[0].label}
                        defaultValue          = {locationEmail[0].label}
                        queryDelay            = {530}
                        country               = {["mx", "usa"]}
                        placeholder           = "Cancún..."
                        onSuggestSelect       = {(e:any) => handleSelect(e)}
                        autoComplete          = "off"
                        inputClassName        = {styles.buscador}
                        suggestsClassName     = {styles.respuesta}
                        suggestItemClassName  = {styles.item}
                        disabled              = {isUserByPay() ? true:false}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={2} sm={1}>
                    <Tooltip
                      title     = {'Filtros'}
                      placement = "bottom"
                    >
                      <button type="button" onClick={() => handleFilter(0)} style={{ border: 0, background: 'white'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" fill="currentColor" className="bi bi-filter-circle text-primary" viewBox="0 0 16 16">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                          <path d="M7 11.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                      </button>
                    </Tooltip>
                  </Col>
                </Row>
                {locationEmail && (locationEmail.length != 0) && locationEmail.map((item:any, key: number) => {
                   if(key != 0) {
                    return(
                      <Row className="mx-2 mb-3">
                        <Col sm={12}>
                          <Form.Label>Zona {key + 1}</Form.Label>
                        </Col>
                        <Col xs={8} sm={10}>
                          <Form.Group className="mb-3">
                            <Geosuggest
                              ref                   = {geosuggestEl}
                              initialValue          = {item.label}
                              value                 = {item.label}
                              defaultValue          = {item.label}
                              queryDelay            = {530}
                              country               = {["mx", "usa"]}
                              placeholder           = "Cancún..."
                              onSuggestSelect       = {(e:any) => handleSelect(e)}
                              autoComplete          = "off"
                              inputClassName        = {styles.buscador}
                              suggestsClassName     = {styles.respuesta}
                              suggestItemClassName  = {styles.item}
                              disabled              = {isUserByPay() ? true:false}
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={2} sm={1}>
                          <Tooltip
                            title     = {'Filtros'}
                            placement = "bottom"
                          >
                            <button type="button" onClick={() => handleFilter(key)} style={{ border: 0, background: 'white'}}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" fill="currentColor" className="bi bi-filter-circle text-primary" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M7 11.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
                              </svg>
                            </button>
                          </Tooltip>
                        </Col>
                        <Col xs={2} sm={1}> 
                          <Tooltip
                            title     = {'Eliminar'}
                            placement = "bottom"
                          >
                            <button type="button" onClick={() => handleClose(key)} style={{ border: 0, background: 'white'}}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" fill="currentColor" className="bi bi-trash text-danger" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                              </svg>
                            </button>
                          </Tooltip>
                        </Col> 
                      </Row>
                    );
                   }
                })}
              </Card>
            }

            <Row className="mt-4">
              <Col sm={12}>
                <div className="d-flex justify-content-start">
                  <Modaltitle2 titulo="Redes Sociales" />
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Form.Group className="mb-3">
                  <Form.Label><b>Sitio web</b></Form.Label>
                  <Form.Control
                    type      = "text"
                    value     = {website}
                    name      = "website"
                    onChange  = {handleChange}
                    disabled  = {isUserByPay() ? true:false}
                  />
                </Form.Group>     
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Form.Group className="mb-3">
                  <Form.Label><b>Facebook</b></Form.Label>
                  <Row>
                    <Col sm={12}>
                      <Form.Text muted>
                        Escriba su página de facebook sin https://www. Ejemplo:
                        facebook.com/mi-pagina-de-facebook
                      </Form.Text>
                      <Form.Control
                        type      = "text"
                        value     = {facebook}
                        name      = "facebook"
                        onChange  = {handleChange}
                        disabled  = {isUserByPay() ? true:false}
                      />
                    </Col>
                  </Row>
                </Form.Group>    
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Form.Group className="mb-3">
                  <Form.Label><b>Instagram</b></Form.Label>
                  <Row>
                    <Col sm={12}>
                      <Form.Text muted>
                        Escriba su página de instagram sin https://www. Ejemplo:
                        instagram.com/mi-pagina-de-instagram
                      </Form.Text>
                      <Form.Control
                        type      = "text"
                        value     = {instagram}
                        name      = "instagram"
                        onChange  = {handleChange}
                        disabled  = {isUserByPay() ? true:false}
                      />
                    </Col>
                  </Row>
                </Form.Group>    
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Form.Group className="mb-3">
                  <Form.Label><b>Twitter</b></Form.Label>
                  <Form.Control
                    type      = "text"
                    value     = {twitter}
                    name      = "twitter"
                    onChange  = {handleChange}
                    disabled  = {isUserByPay() ? true:false}
                  />
                </Form.Group>   
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Form.Group className="mb-3">
                  <Form.Label><b>YouTube</b></Form.Label>
                  <Form.Control
                    type      = "text"
                    value     = {youtube}
                    name      = "youtube"
                    onChange  = {handleChange}
                    disabled  = {isUserByPay() ? true:false}
                  />
                </Form.Group>  
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Form.Group className="mb-3">
                  <Form.Label><b>LinkedIn</b></Form.Label>
                  <Form.Control
                    type      = "text"
                    value     = {linkedin}
                    name      = "linkedin"
                    onChange  = {handleChange}
                    disabled  = {isUserByPay() ? true:false}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3 mb-4">
              <Col sm={12}>
                <Button titulo="Actualizar perfil" />
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      <Modal show = {showFilter} onHide = {modalClose} contentClassName = {styles.modalS2}>
        <Modal.Header closeButton className={styles.modalS2header} />
        <Modal.Body>
          <div className="row">
            <div className="col-12">
              <div className={styles.headTitle}>
                <Modaltitle titulo={`Zona ${index + 1}`} />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className={`${styles.S2content} text-center mt-4 mb-1`}>
                Seleccione los filtros deseados por zona
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
                        <button onClick={() => handleClick(item._id, 'category')} type="button" className={(item._id == category[index] ? styles.bottonContainerSelect:styles.bottonContainer)}>
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
                        <button onClick={() => handleClick(item._id, 'type')} type="button" className={(item._id == type[index] ? styles.bottonContainerSelect:styles.bottonContainer)}>
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
                    <button onClick={() => handleClick(String(item), 'room')} type="button" className={(item == room[index] ? styles.bottonContainerSelect:styles.bottonContainer)}>
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
                    <button onClick={() => handleClick(String(item), 'baths')} type="button" className={(item == bath[index] ? styles.bottonContainerSelect:styles.bottonContainer)}>
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
                    <button onClick={() => handleClick(String(item), 'garages')} type="button" className={(item == garage[index] ? styles.bottonContainerSelect:styles.bottonContainer)}>
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
                <Form.Control type="number" autoComplete="off" defaultValue={price[index].min} min={0} max={price[index].max} name="min_prices"  placeholder="0" onChange={(e:any) => handleInput(Number(e.target.value), 'min_price')} />
              </div>
              <div className="col-5 d-flex justify-content-center">
                <Form.Control type="number" autoComplete="off" defaultValue={price[index].max} min={price[index].min} max={10000000} name="max_prices" placeholder="10000000" onChange={(e:any) => handleInput(Number(e.target.value), 'max_price')} />
              </div>
            </div>
            <div className="row my-1">
              <div className="col-12">
                <Form.Label className={styles.S3labels} htmlFor="grounds">Terreno</Form.Label>
              </div>
              <div className="col-1"></div>
              <div className="col-5 d-flex justify-content-center">      
                <Form.Control type="number" autoComplete="off" defaultValue={ground[index].min} min={0} max={ground[index].max} name="min_grounds" placeholder="0" onChange={(e:any) => handleInput(Number(e.target.value), 'min_ground')} />
              </div>
              <div className="col-5 d-flex justify-content-center">
                <Form.Control type="number" autoComplete="off" defaultValue={ground[index].max} min={ground[index].min} max={10000} name="max_grounds" placeholder="10000" onChange={(e:any) => handleInput(Number(e.target.value), 'max_ground')} />
              </div>
            </div>
            <div className="row my-1">
              {(loadingSet) ? <Loading />:
                <>
                  <div className="col-12">
                    <Form.Label className={styles.S3labels} htmlFor="sets">Conjunto</Form.Label>
                  </div>
                  <div className="col-6 d-flex justify-content-center my-1">
                    <button onClick={() => handleClick('all', 'set')} type="button" className={((set[index] == 'all') ? styles.bottonContainerSelect:styles.bottonContainer)}>
                      Todos
                    </button>
                  </div>
                  {sets && (sets.length != 0) && sets.map((item:any, key: number ) => {
                    return (
                      <div key={key} className="col-6 d-flex justify-content-center my-1">
                        <button onClick={() => handleClick(item._id, 'set')} type="button" className={(item._id == set[index] ? styles.bottonContainerSelect:styles.bottonContainer)}>
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
                <Form.Control type="number" autoComplete="off" defaultValue={build[index].min} min={0} max={build[index].max} name="min_bluids" placeholder="0" onChange={(e:any) => handleInput(Number(e.target.value), 'min_build')} />
              </div>
              <div className="col-5 d-flex justify-content-center">
                <Form.Control type="number" autoComplete="off" defaultValue={build[index].max} min={build[index].min} max={10000} name="max_bluids" placeholder="10000" onChange={(e:any) => handleInput(Number(e.target.value), 'max_build')} />
              </div>
            </div>
            <div className="row my-2">
              <div className="col-12">
                <Form.Label className={styles.S3labels} htmlFor="ranges">Rango(KM)</Form.Label>
              </div>
              <div className="col-1"></div>
              <div className="col-10">
                {((rangeTemp) ? true:true) &&
                  <RangeSlider
                    value     = {range[index]}
                    min       = {50}
                    max       = {300}
                    step      = {50}
                    onChange  = {(e:any) => handleInput(Number(e.target.value), 'range')}
                  /> 
                }
              </div>          
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ActualizarPerfilForm;
