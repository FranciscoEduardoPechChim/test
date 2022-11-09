import { useContext, useRef, useState } from "react";
import { Container} from "react-bootstrap";
import { AuthContext } from "context/auth/AuthContext";
import { useReferenciasUsuario } from "hooks/useReferencias";
import Loading from "components/ui/loading/Loading";
import { formatPrice } from "helpers/formatPrice";
import styles from "./Referencias.module.css";
import { subirComprobanteFetch } from "../../../../helpers/fetch";
import { toast } from "react-toastify";

//Material UI
import TablePagination from '@material-ui/core/TablePagination';

const ListaReferencias = () => {
  const { auth } = useContext(AuthContext);
  const refAdjuntar = useRef<HTMLInputElement>(null);
  const [desde, setDesde] = useState(0);
  const [subiendo, setSubiendo] = useState(false);
  const [comprobante, setcomprobante] = useState("");
  const [seleccionado, setSeleccionado] = useState("");
  const { cargando, referencias, total, setReferencias, setOffset } =
    useReferenciasUsuario(auth.uid, desde);

  const [page, setPage]                 = useState(0);
  const [rowsPerPage, setRowsPerPage]   = useState(10);

  const handleChangePage                = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);  
    setDesde(newPage * rowsPerPage);
  };

  const handleChangeRowsPerPage         = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setOffset(parseInt(event.target.value));
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
    setDesde(0);
  };

  const handleAdjuntar = (id: string) => {
    refAdjuntar.current?.click();
    setSeleccionado(id);
  };

  const subirComprobante = async (uid: string, rid: string) => {
    setSubiendo(true);

    const formData = new FormData();
    formData.append("comprobante", comprobante);

    const res = await subirComprobanteFetch(
      `subidas/comprobante/${uid}/${rid}`,
      formData
    );

    if (res.ok) {
      toast.success(res.msg);
      const refAprobada = referencias?.map((ref) => {
        if (ref._id === rid) {
          return { ...ref, comprobante: res.referencia.comprobante };
        }

        return ref;
      });
      setReferencias(refAprobada);
    }

    setSubiendo(false);
    setSeleccionado("");
  };

  return (
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
                    <th className="">Referencia</th>
                    <th className="">CLABE</th>
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

                        <td className={`${styles.content}`}>
                          12345645678456123
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
                          {referencia.comprobante ? (
                            <div className="d-flex justify-content-center">
                              <a
                                className={`${styles.btnVer}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                href={referencia.comprobante}
                              >
                                <i className="bi bi-image-fill mx-2" />
                              </a>
                              {referencia.estado ? null : (
                                <>
                                  <i
                                    onClick={() =>
                                      handleAdjuntar(referencia._id)
                                    }
                                    className="bi bi-camera-fill pointer mx-2"
                                    style={{
                                      fontSize: 22,
                                      color: "#7149bc",
                                    }}
                                  />
                                  {seleccionado === referencia._id &&
                                    comprobante !== "" ? (
                                    <i
                                      className={`bi bi-cloud-arrow-up-fill pointer mx-2 ${styles.btnSubir}`}
                                      onClick={() =>
                                        subirComprobante(
                                          referencia.usuario._id,
                                          referencia._id
                                        )
                                      }
                                    >
                                    </i>
                                  ) : null}
                                </>
                              )}
                            </div>
                          ) : (
                            <>
                              {seleccionado === referencia._id &&
                                comprobante !== "" ? (
                                <span
                                  className={`bi bi-cloud-arrow-up-fill ${styles.btnSubir}`}
                                  onClick={() =>
                                    subirComprobante(
                                      referencia.usuario._id,
                                      referencia._id
                                    )
                                  }
                                >
                                </span>
                              ) : (
                                <>
                                  {referencia.estado ? null : (
                                    <div className="d-flex justify-content-center">
                                      <i
                                        onClick={() =>
                                          handleAdjuntar(referencia._id)
                                        }
                                        className="bi bi-camera-fill pointer"
                                        style={{
                                          fontSize: 22,
                                          color: "#269e1b",
                                        }}
                                      />
                                    </div>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </td>
                        <td className={`${styles.content}`}>
                          {referencia.estado ? "Aprobado" : "Pendiente"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <input
                  style={{ display: "none" }}
                  ref={refAdjuntar}
                  type="file"
                  accept="image/*"
                  onChange={(e: any) => setcomprobante(e.target.files[0])}
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
  );
};

export default ListaReferencias;
