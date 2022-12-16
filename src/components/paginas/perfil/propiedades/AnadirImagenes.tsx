import {
  CSSProperties,
  FormEvent,
  useContext,
  useEffect,
  useCallback,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import { Form, Modal, Button as Buttons } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { AuthContext } from '../../../../context/auth/AuthContext';
import { InmuebleContext } from '../../../../context/inmuebles/InmuebleContext';
import { useUsuariosPorDir } from '../../../../hooks/useUserInfo';
import Button from '../../../ui/button/Button';
import styles from './AgregaImg.module.css';
import Loading from '../../../ui/loading/Loading';
import { production } from 'credentials/credentials';
import { useUltimoInmueble } from '../../../../hooks/useUserInfo';
import { toast, ToastContainer } from "react-toastify";
import Modaltitle from "../../../ui/modaltitle/Modaltitle";

const thumb: CSSProperties = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #7149BC',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box',
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%',
};

interface Props {
  // handleSubmit:     () => void;
  handlePrevStep:   (step:number) => void;
  images:           any,
  setImages:        (image: any) => void;
  removeImages:     any;
  setRemoveImages:  (image: any) => void;
  action:           string
}

const AnadirImagenes                    = (props: Props) => {
  const {
    handlePrevStep,
    // handleSubmit,
    images,
    setImages,
    removeImages,
    setRemoveImages,
    action
  }                                     = props;
  const { auth }                        = useContext(AuthContext);
  const { subirImagenesInmueble }       = useContext(InmuebleContext);
  const router                          = useRouter();
  const [cargando, setCargando]         = useState(false);
  const { ultimoInmueble }              = useUltimoInmueble(auth.uid);
  const [opciones, setOpciones]         = useState(false);
  const [agregarVideo, setAgregarVideo] = useState(false);
  const [direccionInm, setDireccionInm] = useState<string | undefined>('');
  const [select, setSelect]             = useState(-1);
  const [change, setChange]             = useState(-1);
  const [showModal, setShowModal]       = useState(false);

  const { usuariosPorDir }              = useUsuariosPorDir(direccionInm);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ['image/png', 'image/jpg', 'image/jpeg', 'image/blob'],
    maxFiles: 20,
    onDrop: useCallback((acceptedFiles: any, rejectFiles: any) => {
      if(acceptedFiles.length < 20) {

        acceptedFiles.map((file: any) => {
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            });
            
            setImages((state:any) => [...state, file]) ;
        });

      }else {
        toast.error('El máximo de imagenes permitido es 20');
        setImages([]);
      }

      if(rejectFiles.length > 0) {
        toast.error('Formato inconrrecto, solo se aceptan imagenes tipo: png, jpg, jpeg y blob');
      }
    }, [])
  });

  const changeOrden                     = () => {
    if(images && String(select) && String(change) && (images.length >= select) && (images.length >= (change - 1)) && (select >= 0) && ((change -1) >= 0) && (select != (change -1))) {
      const selectTemp                  = images[select];
      const changeTemp                  = images[(change - 1)];
      const newPictures                 = [...images];
      newPictures.splice(select, 1, changeTemp);
      newPictures.splice((change - 1), 1, selectTemp);
 
      setImages(newPictures);
      modalClose();
    }
  }

  const loadImages                      = (value: number) => {
    setSelect(value); 
    setShowModal(true);
  }

  const modalClose                      = () =>{
    setSelect(-1);
    setChange(-1);
    setShowModal(false);
  }
  
  const remove                          = (file: any) => {
    const newPictures                   = [...images];

    if(action != 'create') {
      if(typeof newPictures[file] == 'string') {
        const destroyPicture            = [...removeImages, newPictures[file]];
        setRemoveImages(destroyPicture);
      }
    }
  
    newPictures.splice(file, 1);
    setSelect(-1); 
    setChange(-1);
    setImages(newPictures);
  }

  useEffect(() => {
  }, [images]);

  const thumbs = images.map((file: any, i: number) => (
    <div style={thumb} key={i}>
      <div style={thumbInner}>
        <span style={{position: 'absolute', color: 'black', fontWeight: 'bolder'}}>{i + 1}</span>
        <img src={(action == 'create') ? file.preview:((typeof file == 'string') ? file:file.preview)} onClick={() => loadImages(i)} style={img} />
        <img
          className={`${styles.btnicon} pointer`}
          onClick={() => remove(i)}
          //src="/images/icons/properties-icons/rechazado.png"
          src="https://res.cloudinary.com/dhcyyvrus/image/upload/v1669660533/images/rechazado_lwm2vl.png"
          alt=""
        />
      </div>
    </div>
  ));

  //const ultimoInmuebles = ultimoInmueble ? ultimoInmueble[0] : null;

  // const uploadPictures = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setCargando(true);
  //   const formData = new FormData();

  //   for (let i = 0; i < images.length; i++) {
  //     formData.append('pictures', images[i]);
  //   }

  //   const res = await subirImagenesInmueble(
  //     formData,
  //     auth.uid,
  //     ultimoInmuebles?._id,
  //     ''
  //   );

  //   if (res.ok) {
  //     setDireccionInm(ultimoInmuebles?.direccion);
  //     usuariosPorDir?.forEach(async (usuario) => {
  //       const body = {
  //         nombre: usuario.nombre,
  //         apellido: usuario.apellido,
  //         correo: usuario.correo,
  //         tituloInmueble: ultimoInmuebles?.titulo,
  //         slug: ultimoInmuebles?.slug,
  //         imgInmueble: res.imgs[0],
  //       };

  //       await fetch(`${production}/correos/inmueble-zona`, {
  //         method: 'POST',
  //         headers: { 'Content-type': 'application/json' },
  //         body: JSON.stringify(body),
  //       });
  //     });
  //   }

  //   setCargando(false);
  //   setOpciones(true);
  // };

  // const inmuebleCreado = () =>
  //   router.push(`/propiedades/${ultimoInmuebles?.slug}`);

  // const verMisInmuebles = () => router.push('/perfil/mis-propiedades');

  // const mostrarVideoUpload = () => setAgregarVideo(!agregarVideo);

  return (
    <>
      {
        <>
          {(!opciones) &&(
            <>
              <div className="cargarImagen" {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="text-center">
                  <img
                    className="my-4 pointer"
                    //src="/images/content/agregafoto.png"
                    src="https://res.cloudinary.com/dhcyyvrus/image/upload/v1669660510/images/agregafoto_ntinp3.png"
                    alt="red1a1"
                    style={{ width: '70%' }}
                  />
                </div>
              </div>
              <div className="text-center mt-2">{thumbs}</div>
              {cargando ? <Loading /> : null}
            </>
          )}
        </>
      }
      <Form.Group className="mb-3">
        <Form.Control
          style={{ display: 'none' }}
          type="file"
          multiple
          accept="image/*"
        />
      </Form.Group>

      <div className='row'>
          <div className='col-12 my-3'>
            <Button 
              titulo  = "Anterior" 
              onClick = {() => handlePrevStep(2)} 
              style   = {{ width: 160, height: 60}}
            />
          <span className="mx-2" />
            <Button 
              titulo  = {(action == 'create') ? "Crear":"Actualizar"}
              style   = {{ width: 160, height: 60}}
            />
          </div>
      </div> 

      <Modal
        show              = {showModal}
        onHide            = {modalClose}
        contentClassName  ={styles.modalContent}
      >
        <Modal.Header
          closeButton
          style={{
            border: "none",
          }}
        />
   
        <Modal.Body>
          <Form>
            <div className="row d-flex justify-content-center">
              <Modaltitle titulo="Ordenar" />

              <div className='row'>
                <div className='col-6'>
                  <Form.Label className={styles.modalLabels} htmlFor="after">Antes</Form.Label>
                  <Form.Control defaultValue={(select + 1)} id="after" type="number" name="after" min={1} disabled />
                </div>
                <div className='col-6'>
                  <Form.Label className={styles.modalLabels} htmlFor="before">Después</Form.Label>
                  <Form.Control defaultValue={(change == -1) ? '':change} id="before" type="number" name="before" min={1} onChange={(e:any) => setChange(Number(e.target.value))}/>
                </div>
              </div>

              <div className='row mt-5 mb-2'>
                <div className='col-12 d-flex justify-content-end'>
                  <Buttons type="button" variant="success" onClick={() => changeOrden()}>Guardar</Buttons>
                  <Buttons className='mx-1' type="reset" variant="danger" onClick={() => modalClose()}>Cancelar</Buttons>
                </div>
              </div>
             
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AnadirImagenes;
