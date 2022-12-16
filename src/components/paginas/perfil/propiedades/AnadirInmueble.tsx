import { FormEvent, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { Form } from "react-bootstrap";
import Titulo from "../../../ui/titulo/Titulo";
import AnadirImagenes from "./AnadirImagenes";
import Formulario from "./Formulario";
// import FormStepOne from "./FormStepOne";
import { useForm } from "../../../../hooks/useForm";
import { MapContext } from "../../../../context/map/MapContext";
import Button from "../../../ui/button/Button";
import Steps from "./Steps";
import {
  InmuebleContext,
  InmuebleData,
} from "../../../../context/inmuebles/InmuebleContext";
import { AuthContext } from "context/auth/AuthContext";
import { casasC, rentas, conjunto } from "credentials";


const FormStepOne: any = dynamic(() => import("./FormStepOne"), { ssr: false });

interface Props {
  action: string;
  data?:  any;
}

const AnadirInmueble                            = ({ action, data }: Props) => {
  const access_token                            = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
  const router                                  = useRouter();
  const { ubicacion, direccion, setUbicacion, 
    setDireccion }                              = useContext(MapContext);
  const { createProperty, editProperty }        = useContext(InmuebleContext);
  const { auth }                                = useContext(AuthContext);
  const [cargando, setCargando]                 = useState(false);
  const [steps, setSteps]                       = useState(1);
  const [tipoPropiedad, setTipoPropiedad]       = useState((action == 'create') ? casasC:((data && data.tipoPropiedad._id) ? data.tipoPropiedad._id:casasC));
  const [categoria, setCategoria]               = useState((action == 'create') ? rentas:((data && data.categoria._id) ? data.categoria._id:rentas));
  const [set, setSet]                           = useState((action == 'create') ? conjunto:((data && data && data.set) ? data.set:conjunto));
  const [amueblado, setAmueblado]               = useState((action == 'create') ? false:((data && data.amueblado) ? data.amueblado:false));
  const [alias, setAlias]                       = useState((action == 'create') ? '':((data && data.alias) ? data.alias:''));
  const [agua, setAgua]                         = useState<any>((action == 'create') ? false:((data && data.agua) ? data.agua:false));
  const [luz, setLuz]                           = useState<any>((action == 'create') ? false:((data && data.luz) ? data.luz:false));
  const [gas, setGas]                           = useState<any>((action == 'create') ? false:((data && data.gas) ? data.gas:false));
  const [internet, setInternet]                 = useState<any>((action == 'create') ? false:((data && data.internet) ? data.internet:false));
  const [seguridadPrivada, setSeguridadPrivada] = useState<any>((action == 'create') ? false:((data && data.seguridadPrivada) ? data.seguridadPrivada:false));
  const [escuelas, setEscuelas]                 = useState<any>((action == 'create') ? false:((data && data.escuelas) ? data.escuelas:false));
  const [mantenimiento, setMantenimiento]       = useState<any>((action == 'create') ? false:((data && data.mantenimiento) ? data.mantenimiento:false));
  const [piscina, setPiscina]                   = useState<any>((action == 'create') ? false:((data && data.piscinas) ? data.piscinas:false));
  const [discapacitados, setDiscapacitados]     = useState<any>((action == 'create') ? false:((data && data.discapacitados) ? data.discapacitados:false));
  const [camas, setCamas]                       = useState<any>((action == 'create') ? false:((data && data.camas) ? data.camas:false));
  const [closet, setCloset]                     = useState<any>((action == 'create') ? false:((data && data.closet) ? data.closet:false));
  const [sala, setSala]                         = useState<any>((action == 'create') ? false:((data && data.sala) ? data.sala:false));
  const [comedor, setComedor]                   = useState<any>((action == 'create') ? false:((data && data.comedor) ? data.comedor:false));
  const [cocina, setCocina]                     = useState<any>((action == 'create') ? false:((data && data.cocina) ? data.cocina:false));
  const [AA, setAA]                             = useState<any>((action == 'create') ? false:((data && data.AA) ? data.AA:false));
  const [refrigerador, setRefrigerador]         = useState<any>((action == 'create') ? false:((data && data.refrigerador) ? data.refrigerador:false));
  const [estufa, setEstufa]                     = useState<any>((action == 'create') ? false:((data && data.estufa) ? data.estufa:false));
  const [microondas, setMicroondas]             = useState<any>((action == 'create') ? false:((data && data.microondas) ? data.microondas:false));
  const [minihorno, setMinihorno]               = useState<any>((action == 'create') ? false:((data && data.minihorno) ? data.minihorno:false));
  const [horno, setHorno]                       = useState<any>((action == 'create') ? false:((data && data.horno) ? data.horno:false));
  const [lavadora, setLavadora]                 = useState<any>((action == 'create') ? false:((data && data.lavadora) ? data.lavadora:false));
  const [secadora, setSecadora]                 = useState<any>((action == 'create') ? false:((data && data.secadora) ? data.secadora:false));
  const [images, setImages]                     = useState<any>((action == 'create') ? []:((data && data.imgs && (data.imgs.length > 0)) ? data.imgs:[]));
  const [removeImages, setRemoveImages]         = useState<any>([]);

  const { formulario, handleChange }            = useForm({
    titulo:                                     (action == 'create') ? "":((data && data.titulo)    ? data.titulo:""),
    precio:                                     (action == 'create') ? 0:((data && data.precio)     ? data.precio:0),
    comisiones:                                 (action == 'create') ? 0:((data && data.comisiones) ? data.comisiones:0),
    antiguedad:                                 (action == 'create') ? "":((data && data.antiguedad) ? data.antiguedad:""),
    m2Construidos:                              (action == 'create') ? 0:((data && data.m2Construidos) ? data.m2Construidos:0),
    m2Terreno:                                  (action == 'create') ? 0:((data && data.m2Terreno) ? data.m2Terreno:0),
    habitaciones:                               (action == 'create') ? 0:((data && data.habitaciones) ? data.habitaciones:0),
    baños:                                      (action == 'create') ? 0:((data && data.baños) ? data.baños:0),
    medioBaños:                                 (action == 'create') ? 0:((data && data.medioBaños) ? data.medioBaños:0),
    parking:                                    (action == 'create') ? 0:((data && data.parking) ? data.parking:0),
    pisos:                                      (action == 'create') ? 0:((data && data.pisos) ? data.pisos:0),
    descripcion:                                (action == 'create') ? "":((data && data.descripcion) ? data.descripcion:""),
    otros:                                      (action == 'create') ? "":((data && data.otros) ? data.otros:"")
  });

  const {
    titulo,
    precio,
    comisiones,
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
  }                                             = formulario;

  const handleNextStep                          = (step: number) => {
    if(step && action) {
      setSteps(step);
      router.push((action == 'create') ? "/perfil/agregar-inmueble":((data && data.slug) ? ("/perfil/edit-property/" + data.slug):"/perfil/agregar-inmueble"));
    }
  } 

  const handlePrevStep                          = (step: number) => {
    if(step && action) {
      setSteps(step);
      router.push((action == 'create') ? "/perfil/agregar-inmueble":((data && data.slug) ? ("/perfil/edit-property/" + data.slug):"/perfil/agregar-inmueble"));
    }
  }
 
  const handleSubmit                            = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if(titulo && auth.uid && categoria && String(pisos) && String(medioBaños) && String(habitaciones) && String(m2Construidos) && String(baños) && String(parking) && String(precio) && String(comisiones) && String(m2Terreno) && direccion && descripcion && ubicacion.lat && ubicacion.lng && tipoPropiedad && access_token) {
      setCargando(true);
      let sendImages:any                        = [];
      let order: any                            = [];

      if(action != 'create'){

        // Delete all images
        if(images && (images.length == 0) && data && data.imgs && (data.imgs.length > 0)) {
          for(let i = 0; i < data.imgs.length; i++) {  
            setRemoveImages([...removeImages, data.imgs[i]]);
          }
        }
        
        // Delete images type string
        if(images && (images.length > 0)){
          for(let i = 0; i < images.length; i ++) {
            if(!(typeof images[i] == 'string')) {
              sendImages.push(images[i]);
            }else {
              order.push(i);
            }
          }
        }

        // Without new images
        if(sendImages && (sendImages.length == 0) && data && data.imgs && (data.imgs.length > 0)) {
          order                                 = [];

          for(let i = 0; i < images.length; i++) {
            for(let j = 0; j < data.imgs.length; j ++) {
              if(images[i] == data.imgs[j]) {
                order.push(j);
              }
            }

          }
        }

      }

      const response                            = (action == 'create') ?
      await createProperty(titulo, categoria, tipoPropiedad, set, (typeof alias != 'undefined') ? alias:null, ubicacion.lat, ubicacion.lng, Number(precio), comisiones, (typeof antiguedad != 'undefined') ? antiguedad:null, m2Terreno, baños, parking, (typeof agua.value != 'undefined') ? agua.value:null, (typeof gas.value != 'undefined') ? gas.value:null, (typeof seguridadPrivada.value != 'undefined') ? seguridadPrivada.value:null, (typeof mantenimiento.value != 'undefined') ? mantenimiento.value:null, (typeof discapacitados.value != 'undefined') ? discapacitados.value:null, m2Construidos, habitaciones, medioBaños, pisos, (typeof luz.value != 'undefined') ? luz.value:null, (typeof internet.value != 'undefined') ? internet.value:null, (typeof escuelas.value != 'undefined') ? escuelas.value:null, (typeof piscina.value != 'undefined') ? piscina.value:null, amueblado, (typeof camas.value != 'undefined') ? camas.value:null, (typeof sala.value != 'undefined') ? sala.value:null, (typeof cocina.value != 'undefined') ? cocina.value:null, (typeof refrigerador.value != 'undefined') ? refrigerador.value:null, (typeof microondas.value != 'undefined') ? microondas.value:null, (typeof horno.value != 'undefined') ? horno.value:null, (typeof secadora.value != 'undefined') ? secadora.value:null, (typeof closet.value != 'undefined') ? closet.value:null, (typeof comedor.value != 'undefined') ? comedor.value:null, (typeof AA.value != 'undefined') ? AA.value:null, (typeof estufa.value != 'undefined') ? estufa.value:null, (typeof minihorno.value != 'undefined') ? minihorno.value:null, (typeof lavadora.value != 'undefined') ? lavadora.value:null, otros, direccion, descripcion, auth.uid, images, access_token):
      await editProperty((data && data._id) ? data._id:'' ,titulo, categoria, tipoPropiedad, set, (typeof alias != 'undefined') ? alias:null, ubicacion.lat, ubicacion.lng, Number(precio), comisiones, (typeof antiguedad != 'undefined') ? antiguedad:null, m2Terreno, baños, parking, (typeof agua.value != 'undefined') ? agua.value:null, (typeof gas.value != 'undefined') ? gas.value:null, (typeof seguridadPrivada.value != 'undefined') ? seguridadPrivada.value:null, (typeof mantenimiento.value != 'undefined') ? mantenimiento.value:null, (typeof discapacitados.value != 'undefined') ? discapacitados.value:null, m2Construidos, habitaciones, medioBaños, pisos, (typeof luz.value != 'undefined') ? luz.value:null, (typeof internet.value != 'undefined') ? internet.value:null, (typeof escuelas.value != 'undefined') ? escuelas.value:null, (typeof piscina.value != 'undefined') ? piscina.value:null, amueblado, (typeof camas.value != 'undefined') ? camas.value:null, (typeof sala.value != 'undefined') ? sala.value:null, (typeof cocina.value != 'undefined') ? cocina.value:null, (typeof refrigerador.value != 'undefined') ? refrigerador.value:null, (typeof microondas.value != 'undefined') ? microondas.value:null, (typeof horno.value != 'undefined') ? horno.value:null, (typeof secadora.value != 'undefined') ? secadora.value:null, (typeof closet.value != 'undefined') ? closet.value:null, (typeof comedor.value != 'undefined') ? comedor.value:null, (typeof AA.value != 'undefined') ? AA.value:null, (typeof estufa.value != 'undefined') ? estufa.value:null, (typeof minihorno.value != 'undefined') ? minihorno.value:null, (typeof lavadora.value != 'undefined') ? lavadora.value:null, otros, direccion, descripcion, auth.uid, sendImages, removeImages, order, access_token);

      if(response) {
        setCargando(false);
        router.push("/perfil/mis-propiedades");
      }
    }
  }

  useEffect(() => {
   if(action != 'create') {
    if(data && data.direccion) {
      setDireccion(data.direccion);
    }
    if(data && data.lat && data.lng){
      setUbicacion({lat: data.lat, lng: data.lng});
    }
   }
  }, []);

  return (
    <section>
      <div className="container">
        <Titulo titulo={(action == 'create') ? "Agrega un inmueble":"Edita un inmueble" }/>
        <br />
        <div className="row d-flex justify-content-center">
          <Steps steps={steps} />

          <div className="col-sm-12 col-md-12 col-lg-8">
            <Form onSubmit={handleSubmit}>
              {(steps === 1) &&
                <>
                  <FormStepOne
                    handleNextStep    = {handleNextStep}
                    handleChange      = {handleChange}
                    titulo            = {titulo}
                    tipoPropiedad     = {tipoPropiedad}
                    setTipoPropiedad  = {setTipoPropiedad}
                    precio            = {precio}
                    comisiones        = {comisiones}
                    categoria         = {categoria}
                    setCategoria      = {setCategoria}
                    set               = {set}
                    setSet            = {setSet}
                    alias             = {alias}
                    setAlias          = {setAlias}
                  />
                </>
              }
              {(steps === 2) &&
                <>
                  <Formulario
                    handleNextStep    = {handleNextStep}
                    handlePrevStep    = {handlePrevStep}
                    handleChange      = {handleChange}
                    antiguedad        = {antiguedad}
                    m2Construidos     = {m2Construidos}
                    m2Terreno         = {m2Terreno}
                    habitaciones      = {habitaciones}
                    baños             = {baños}
                    medioBaños        = {medioBaños}
                    parking           = {parking}
                    pisos             = {pisos}
                    descripcion       = {descripcion}
                    otros             = {otros}
                    amueblado         = {amueblado}
                    setAmueblado      = {setAmueblado}
                    agua              = {agua}
                    luz               = {luz}
                    gas               = {gas}
                    internet          = {internet}
                    seguridadPrivada  = {seguridadPrivada}
                    escuelas          = {escuelas}
                    mantenimiento     = {mantenimiento}
                    piscina           = {piscina}
                    discapacitados    = {discapacitados}
                    camas             = {camas}
                    closet            = {closet}
                    sala              = {sala}
                    comedor           = {comedor} 
                    cocina            = {cocina}
                    AA                = {AA}
                    refrigerador      = {refrigerador}
                    estufa            = {estufa}
                    microondas        = {microondas}
                    minihorno         = {minihorno}
                    horno             = {horno}
                    lavadora          = {lavadora}
                    secadora          = {secadora}
                    setAgua           = {setAgua}
                    setLuz            = {setLuz}
                    setGas            = {setGas}
                    setInternet       = {setInternet}
                    setSeguridadPrivada = {setSeguridadPrivada}
                    setEscuelas       = {setEscuelas}
                    setMantenimiento  = {setMantenimiento}
                    setPiscina        = {setPiscina}
                    setDiscapacitados = {setDiscapacitados}
                    setCamas          = {setCamas}
                    setCloset         = {setCloset}
                    setSala           = {setSala}
                    setComedor        = {setComedor}
                    setCocina         = {setCocina}
                    setAA             = {setAA}
                    setRefrigerador   = {setRefrigerador}
                    setEstufa         = {setEstufa}
                    setMicroondas     = {setMicroondas}
                    setMinihorno      = {setMinihorno}
                    setHorno          = {setHorno}
                    setLavadora       = {setLavadora}
                    setSecadora       = {setSecadora}
                    cargando          = {cargando}
                    action            = {action}
                  />
                </>
              }
              {(steps === 3) && 
                <AnadirImagenes 
                  handlePrevStep  = {handlePrevStep}
                  images          = {images}
                  setImages       = {setImages}
                  removeImages    = {removeImages}
                  setRemoveImages = {setRemoveImages}
                  action          = {action}
                />
              }
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnadirInmueble;
