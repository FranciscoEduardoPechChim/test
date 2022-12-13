import { useContext, useRef, useState } from "react";
import { Container, Modal, Button} from "react-bootstrap";
import { AuthContext } from "context/auth/AuthContext";
import { useReferenciasUsuario } from "hooks/useReferencias";
import Loading from "components/ui/loading/Loading";
import { formatPrice } from "helpers/formatPrice";
import styles from "./Referencias.module.css";
import { subirComprobanteFetch } from "../../../../helpers/fetch";
import { toast } from "react-toastify";

//Material UI
import TablePagination from '@material-ui/core/TablePagination';
//Services
import { loadImages, deleteImages } from '../../../../services/referenceService';
//Helpers
import { validate } from '../../../../helpers/response';

const ListaReferencias = () => {
  const { auth } = useContext(AuthContext);
  const refAdjuntar = useRef<HTMLInputElement>(null);
  const [desde, setDesde] = useState(0);
  const [subiendo, setSubiendo] = useState(false);
  const [comprobante, setcomprobante] = useState("");
  const [seleccionado, setSeleccionado] = useState("");
  const { cargando, referencias, total, setReferencias, setOffset, obtenerReferencias } =
    useReferenciasUsuario(auth.uid, desde);

  const access_token                    = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
  const [page, setPage]                 = useState(0);
  const [rowsPerPage, setRowsPerPage]   = useState(10);
  const [rid, setRid]                   = useState('');
  const [uid, setUid]                   = useState('');
  const [modal, setModal]               = useState(false);
  const [link, setLink]                 = useState('');

  const handleChangePage                = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);  
    setDesde(newPage * rowsPerPage);
  }

  const handleChangeRowsPerPage         = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setOffset(parseInt(event.target.value));
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
    setDesde(0);
  }

  const handleOpenImages                = (uid: string, rid: string) => {
    if(refAdjuntar.current && uid && rid) {
      setUid(uid);
      setRid(rid);
      refAdjuntar.current.click();
    }
  }

  const handleImages                    = async (e: any) => {
    if(e && uid && rid && access_token) {
      setSubiendo(true);

      const response                    = await loadImages(e, uid, rid, access_token);

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

        const refAprobada = referencias?.map((ref) => {
          if ((ref._id === rid) && response.data) {
            return { ...ref, comprobante: response.data.references.comprobante };
          }

          return ref;
        });

        setReferencias(refAprobada);
      }

      setSubiendo(false);
      setSeleccionado("");
    }
  }

  const modalShow                       = async (link: string) => {
    if(link) {
      setLink(link);
      setModal(true);
    }
  }

  const modalClose                      = () => {
    setModal(false);
  }

  const handleDeleteImages              = async (rid: string) => {
    if(rid && access_token) {
      setSubiendo(true);
      const response                    = await deleteImages(rid, access_token);

      if(response && response.ok) {
        toast.error(response.msg);
        return false;
      }

      if(response && response.data) {
        toast.success(response.msg);
        obtenerReferencias();
        setSubiendo(false);
      }
    }
  }

  return (
    <>
      <Container>
        <br />
        {cargando ? (
          <Loading />
        ) : (
          <div className="row">
            {referencias?.length === 0 ? (
              <div className={`${styles.titulo} text-center`}>
                Aún no has creado ninguna referencia
              </div>
            ) : (
              <div className="col-12">
                <div className="table-responsive-xxl">
                  <table className={`${styles.customTable} table`}>
                    <tbody>
                      <th className="">ID</th>
                      <th className="">Beneficiario</th>
                      <th className="">Paquete</th>
                      <th className="text-center">PPU</th>
                      <th className="text-center">Usuarios</th>
                      <th className="text-center">Total</th>
                      <th className="text-center">Comprobante</th>
                      <th className="">Estado</th>

                      {referencias?.map((referencia) => (
                        <tr key={referencia._id} className={`${styles.thover} `}>
                          <td className={`${styles.content}`}>
                            {referencia.referencia}
                          </td>
                          <td className={`${styles.content}`}>Red 1a1</td>
                          <td className={`${styles.content}`}>
                            {referencia.paquete.nombre}
                          </td>
                          <td className={`${styles.content} text-center`}>
                            {formatPrice(referencia.precio)}
                          </td>
                          <td className={`${styles.content} text-center`}>
                            {referencia.totalUsuarios <= 1
                              ? "N/A"
                              : referencia.totalUsuarios}
                          </td>
                          <td className={`${styles.content} text-center`}>
                            {formatPrice(referencia.importe)}
                          </td>
                          <td className={`${styles.content} text-center pt-1 pb-0`}>
                            {referencia.comprobante ?
                              <div className="d-flex justify-content-center">
                                <i 
                                  onClick   = {() => modalShow(referencia.comprobante)}
                                  className = {`bi bi-image-fill mx-2 ${styles.btnVer}`} 
                                />
                                <i
                                  onClick   = {() => handleOpenImages(referencia.usuario._id, referencia._id)}
                                  className = "bi bi-camera-fill pointer mx-2"
                                  style     = {{
                                    fontSize: 22,
                                    color: "#7149bc",
                                  }}
                                />     
                                <i
                                  onClick   = {() => handleDeleteImages(referencia._id)}
                                  className = "bi bi-x-circle-fill pointer mx-2"
                                  style     = {{
                                    fontSize: 22,
                                    color: "#B20003",
                                  }}
                                />      
                              </div>:
                              <>
                                {referencia.estado ? null : (
                                  <div className="d-flex justify-content-center">
                                    <i
                                      onClick   = {() => handleOpenImages(referencia.usuario._id, referencia._id)}
                                      className = "bi bi-camera-fill pointer"
                                      style     = {{
                                        fontSize: 22,
                                        color: "#269e1b",
                                      }}
                                    />
                                  </div>
                                )}
                              </>
                            }
                          </td>
                          <td className={`${styles.content}`}>
                            {referencia.estado ? "Aprobado" : "Pendiente"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <input
                    style     = {{ display: "none" }}
                    ref       = {refAdjuntar}
                    type      = "file"
                    accept    = "image/*"
                    onChange  = {(e: any) => handleImages(e.target.files[0])}
                  />
                  {subiendo ? (
                    <div className="d-flex justify-content-center">
                      <Loading />
                    </div>
                  ) : null}
                </div>
              </div>
            )}
            <TablePagination
                component             = "div"
                count                 = {total}
                page                  = {page}
                onPageChange          = {handleChangePage}
                rowsPerPage           = {rowsPerPage}
                onRowsPerPageChange   = {handleChangeRowsPerPage}
                rowsPerPageOptions    = {[10, 25, 50, 100]}
                labelRowsPerPage      = {'Cantidad'}
                labelDisplayedRows    = {({ from, to, count }) => `${from} - ${to} de ${count}`}
            />
          </div>
        )}
      </Container>
      <Modal
        show              = {modal}
        onHide            = {modalClose}
        contentClassName  = {styles.modalContent}
      >
        <Modal.Header
          closeButton
          style={{
            border: "none",
          }}
        />
   
        <Modal.Body>
          <div className="row d-flex justify-content-center">
            <div className="col-12">
              <img src={link} style={{width: '100%', height: 250}}/>
            </div>
          </div>
          <div className="row mt-5 mb-2">
            <div className="col-12 d-flex justify-content-end">
              <Button className='mx-1' type="reset" variant="outline-secondary" onClick={() => modalClose()}>Cerrar</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ListaReferencias;
