import { useContext, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { AuthContext } from "../../../../context/auth/AuthContext";
import { InmuebleContext } from "../../../../context/inmuebles/InmuebleContext";
import { useUserInmuebles } from "../../../../hooks/useUserInfo";
import Loading from "../../../ui/loading/Loading";
import PropertiesCard from "../../../ui/propertiescard/PropertiesCard";
import styles from "./MisPropiedades.module.css";

//Material UI
import TablePagination from '@material-ui/core/TablePagination';


const MiListaPropiedades = () => {
  const { auth } = useContext(AuthContext);
  const { eliminarInmueble, actualizarInmueble } = useContext(InmuebleContext);
  const [desde, setDesde] = useState(0);
  const { cargando, inmuebles, total, setInmuebles, setOffset } = useUserInmuebles(
    auth.uid,
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

  const handleDelete = async (pid: string) => {
    await eliminarInmueble(pid);
    const nuevosInmuebles = inmuebles?.filter(
      (inmueble) => inmueble._id !== pid
    );
    setInmuebles(nuevosInmuebles);
  };

  const handleActivar = async (pid: string) => {
    await actualizarInmueble({ publicado: true }, pid);

    const inmuebleActualizado = inmuebles?.map((inmueble) => {
      if (inmueble._id === pid) {
        return { ...inmueble, publicado: true };
      }

      return inmueble;
    });

    setInmuebles(inmuebleActualizado);
  };

  const handleDesactivar = async (pid: string) => {
    await actualizarInmueble({ publicado: false }, pid);

    const inmuebleActualizado = inmuebles?.map((inmueble) => {
      if (inmueble._id === pid) {
        return { ...inmueble, publicado: false };
      }

      return inmueble;
    });

    setInmuebles(inmuebleActualizado);
  };

  return (
    <Container>
      <Row>
        {cargando ? (
          <Loading />
        ) : (
          <>
            {inmuebles?.length === 0 ? (
              <h1 className={`${styles.titulo} text-center`}>
                Al parecer aún no tienes ningún inmueble
              </h1>
            ) : (
              <>
                {inmuebles?.map((inmueble) => (
                  <PropertiesCard
                    key={inmueble._id}
                    id={inmueble._id}
                    slug={inmueble.slug}
                    titulo={inmueble.titulo}
                    imgs={inmueble.imgs}
                    isActive={inmueble.publicado}
                    handleDelete={handleDelete}
                    handleActivar={handleActivar}
                    handleDesactivar={handleDesactivar}
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
                  labelDisplayedRows    = {({ from, to, count }) => `${from}-${to} de ${count}`}
                />
              </>
            )}
          </>
        )}
      </Row>
    </Container>
  );
};

export default MiListaPropiedades;
