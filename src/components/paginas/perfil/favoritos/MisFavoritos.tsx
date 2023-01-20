import { InmuebleContext } from "context/inmuebles/InmuebleContext";
import { useContext, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { AuthContext } from "../../../../context/auth/AuthContext";
import { eliminarFavorito } from "../../../../helpers/fetch";
import { useMisFavoritos } from "../../../../hooks/useFavoritos";
import Loading from "../../../ui/loading/Loading";
import FavPropertiesCard from "../../../ui/propertiescard/FavPropertiesCard";
import styles from "./FiltrosFavs.module.css";

//Material UI
import TablePagination from '@material-ui/core/TablePagination';

const MiListaFavoritos = () => {
  const { auth } = useContext(AuthContext);
  const { dueño } = useContext(InmuebleContext);
  const [desde, setDesde] = useState(0);
  const { misFavoritos, cargando, total, setMisFavoritos, setOffset } = useMisFavoritos(
    auth.uid,
    dueño,
    desde
  );

  const [page, setPage]                 = useState(0);
  const [rowsPerPage, setRowsPerPage]   = useState(12);

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

  const handleDelete = async (id: string) => {
    const resp = await eliminarFavorito(`favoritos/${id}`);
    if (resp.ok) {
      toast.success(resp.msg);
    }

    const nuevosFavoritos = misFavoritos.filter(
      (favorito) => favorito._id !== id
    );

    setMisFavoritos(nuevosFavoritos);
  };

  return (
    <Container>
      <div className={`${styles.colorTotal} d-flex justify-content-end`}>
          TOTAL: {total}
      </div>
      <Row>
        {cargando ? (
          <Loading />
        ) : (
          <>
            {misFavoritos.length === 0 ? (
              <div className={`${styles.titulo} text-center`}>
                Aún no has agregado favoritos
              </div>
            ) : (
              <>
                {misFavoritos.map((favorito) => (
                  <FavPropertiesCard
                    key={favorito._id}
                    id={favorito._id}
                    titulo={
                      favorito.inmueble
                        ? favorito.inmueble.titulo
                        : "Inmueble dado de baja por el promotor"
                    }
                    slug={favorito.inmueble ? favorito.inmueble.slug : ""}
                    img={favorito.inmueble ? favorito.inmueble.imgs : ""}
                    solicitud={favorito.solicitud}
                    propietario={favorito.propietario}
                    handleDelete={handleDelete}
                  />
                ))}
                <TablePagination
                  component             = "div"
                  count                 = {total}
                  page                  = {page}
                  onPageChange          = {handleChangePage}
                  rowsPerPage           = {rowsPerPage}
                  onRowsPerPageChange   = {handleChangeRowsPerPage}
                  rowsPerPageOptions    = {[12, 24, 48, 98]}
                  labelRowsPerPage      = {'Cantidad'}
                  labelDisplayedRows    = {({ from, to, count }) => `${from} - ${to} de ${count}`}
                />
              </>
            )}
          </>
        )}
      </Row>
    </Container>
  );
};

export default MiListaFavoritos;
