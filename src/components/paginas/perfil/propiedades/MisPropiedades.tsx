import { useContext, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { AuthContext } from "../../../../context/auth/AuthContext";
import { InmuebleContext } from "../../../../context/inmuebles/InmuebleContext";
import { useUserInmuebles } from "../../../../hooks/useUserInfo";
import Loading from "../../../ui/loading/Loading";
import PropertiesCard from "../../../ui/propertiescard/PropertiesCard";
import styles from "./MisPropiedades.module.css";
import { useRouter } from "next/router";

//Material UI
import TablePagination from '@material-ui/core/TablePagination';
//Context
import { useUserProperties } from '../../../../hooks/useUserInfo';

const MiListaPropiedades                          = () => {
  const access_token                              = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
  const { auth }                                  = useContext(AuthContext);
  const router                                    = useRouter();
  const { removeProperty, changeStatusProperty }  = useContext(InmuebleContext);
  const [desde, setDesde]                         = useState(0);
  const { properties, loading, total, 
        setProperties, setLimit, init }           = useUserProperties((auth.uid) ? auth.uid:'', desde, 12, (access_token) ? access_token:'');
  const [page, setPage]                           = useState(0);
  const [rowsPerPage, setRowsPerPage]             = useState(12);

  const handleChangePage                          = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);  
    setDesde(newPage * rowsPerPage);
  };

  const handleChangeRowsPerPage                   = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLimit(parseInt(event.target.value));
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
    setDesde(0);
  };

  const handleEdit                                = async (pid: string) => {
    if(pid) {
     router.push('/perfil/edit-property/' + pid);
    }
  }

  const handleDelete                              = async (pid: string) => {
    if(pid && access_token) {
      const response                              = await removeProperty(pid, access_token);

      if(response) {
        init();
      }
    }
  }

  const handleStatus                              = async (pid: string, status:boolean) => {
    if(pid && access_token) {
      const response                              = await changeStatusProperty(pid, status, access_token);

      if(response) {
        init();
      }
    }
  }

  return (
    <Container>
      <div className={`${styles.colorTotal} d-flex justify-content-end`}>
        TOTAL: {total}
      </div>
      <Row>
        {loading ? (
          <Loading />
        ) : (
          <>
            {properties?.length === 0 ? (
              <h1 className={`${styles.titulo} text-center`}>
                Al parecer a??n no tienes ning??n inmueble
              </h1>
            ) : (
              <>
                {properties && properties.map((inmueble:any, key: number) => (
                  <PropertiesCard
                    key           = {key}
                    id            = {inmueble._id}
                    slug          = {inmueble.slug}
                    title         = {inmueble.titulo}
                    imgs          = {inmueble.imgs}
                    isActive      = {inmueble.publicado}
                    isFollower    = {false}
                    handleDelete  = {handleDelete}
                    handleStatus  = {handleStatus}
                    handleEdit    = {handleEdit}
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
