import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { AuthContext } from "../../../../context/auth/AuthContext";
import { useHistorial } from "../../../../hooks/useUserInfo";
import Loading from "../../../ui/loading/Loading";
import styles from "./Mihistorial.module.css";
import { publicadoHace } from "../../../../helpers/horaMes";
import { eliminarHist } from "../../../../helpers/fetch";

//Material UI
import TablePagination from '@material-ui/core/TablePagination';

const Mihistorial = () => {
  const { auth } = useContext(AuthContext);
  const router = useRouter();
  const [desde, setDesde] = useState(0);
  const { historial, isLoading, setHistorial, total, setOffset } = useHistorial(
    auth.uid,
    desde
  );

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

  const goToProperty = async (slug: string) => {
    if (slug !== "") {
      router.push("/propiedades/" + slug);
    }
  };

  const handleDelete = async (id: string) => {
    const resp = await eliminarHist(`historial/${id}`);

    const nuevoHistorial = historial?.filter(
      (historial) => historial._id !== id
    );

    setHistorial(nuevoHistorial);
    if (resp.ok) toast.success(resp.msg);
  };
  
  return (
    <section className={styles.section}>
      <div className="container">
        <div className="row">
          <div className="col">
            <br />
            {isLoading ? (
              <Loading />
            ) : (
              <>
                {historial?.length === 0 ? (
                  <div className={`${styles.titulo} text-center`}>
                    No tienes búsquedas recientes
                  </div>
                ) : (
                  <table className={`${styles.customTable}`}>
                    <tbody>
                      {historial?.map((hist, i) => (
                        <tr key={hist._id} className={`${styles.thover}`}>
                          <td className={styles.tNumber}>{i + 1} </td>
                          <td
                            onClick={() =>
                              goToProperty(
                                hist.inmueble ? hist.inmueble.slug : ""
                              )
                            }
                            className={`${styles.content} pointer`}
                          >
                            {hist.inmueble
                              ? hist.inmueble.titulo
                              : "Este inmueble ha sido dado de baja por el promotor"}
                          </td>
                          <td align="center">
                            Visto {publicadoHace(hist.createdAt)}
                          </td>

                          <td align="center">
                            <i
                              onClick={() => handleDelete(hist._id)}
                              className={`${styles.deleteI} bi bi-x-circle-fill pointer`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
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
        </div>
      </div>
    </section>
  );
};

export default Mihistorial;
