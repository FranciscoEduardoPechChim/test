import { useContext, useState } from "react";
import { AuthContext } from "../../../../context/auth/AuthContext";
import { formatPrice } from "../../../../helpers/formatPrice";
import { horaMes } from "../../../../helpers/horaMes";
import { useHistorialPagos } from "../../../../hooks/useUserInfo";
import Loading from "../../../ui/loading/Loading";
import styles from "./HistorialPagos.module.css";

//Material UI
import TablePagination from '@material-ui/core/TablePagination';

const HistorialPagos = () => {
  const { auth } = useContext(AuthContext);
  const [desde, setDesde] = useState(0);
  const { cargando, historialPago, total, setOffset } = useHistorialPagos(auth.uid, desde);

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

  return (
    <div className="container">
      <br />
      {cargando ? (
        <Loading />
      ) : (
        <div className="row">
          {historialPago.length === 0 ? (
            <div className={`${styles.titulo} text-center`}>
              Aún no has añadido ningún paquete
            </div>
          ) : (
            <div className="col-12">
              <div className="table-responsive-xxl">
                <table className={`${styles.customTable} table`}>
                  <tbody>
                    <th className="">ID de pago</th>
                    <th className="">Fecha y hora</th>
                    <th className="">Paquete</th>
                    <th className="">PPU</th>
                    <th className="text-center">Usuarios</th>
                    <th className="">Descuento</th>
                    <th className="">Importe</th>

                    {historialPago.map((pago) => (
                      <tr key={pago._id} className={`${styles.thover} `}>
                        <td className={`${styles.content}`}>{pago._id}</td>
                        <td className={`${styles.content}`}>
                          {horaMes(pago.fechaPago)}
                        </td>
                        <td className={`${styles.content}`}>
                          {pago.paquete.nombre}
                        </td>
                        <td className={`${styles.content}`}>
                          {formatPrice(pago.precio)}
                        </td>
                        <td className={`${styles.content} text-center`}>
                          {pago.totalUsuarios <= 1 ? "N/A" : pago.totalUsuarios}
                        </td>
                        <td className={`${styles.content}`}>
                          N/A
                        </td>
                        <td className={`${styles.content}`}>
                          {formatPrice(pago.importe)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
              labelDisplayedRows    = {({ from, to, count }) => `${from} - ${to}`}
          />
        </div>
      )}
    </div>
  );
};

export default HistorialPagos;
