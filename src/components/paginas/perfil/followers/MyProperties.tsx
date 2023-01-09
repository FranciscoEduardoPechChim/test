//React
import { Container, Row } from "react-bootstrap";
import { useContext, useState } from "react";
//Context
import { AuthContext } from "../../../../context/auth/AuthContext";
//Components
import PropertiesCard from "../../../ui/propertiescard/PropertiesCard";
import Loading from "../../../ui/loading/Loading";
//Hooks
import { useFollowerProperties } from '../../../../hooks/useUserInfo';
//Extras
import TablePagination from '@material-ui/core/TablePagination';
import styles from "./Properties.module.css";

const MyPropertiesFollowers                       = () => {
  const access_token                              = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
  const { auth }                                  = useContext(AuthContext);
  const [from, setFrom]                           = useState(0);
  const { properties, loading, total, setLimit }  = useFollowerProperties((auth.uid) ? auth.uid:'', from, (access_token) ? access_token:'');
  const [page, setPage]                           = useState(0);
  const [rowsPerPage, setRowsPerPage]             = useState(12);

  const handleChangePage                          = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);  
    setFrom(newPage * rowsPerPage);
  };

  const handleChangeRowsPerPage                   = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLimit(parseInt(event.target.value));
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
    setFrom(0);
  };

  return (
    <Container>
      <Row>
        {loading ? (
          <Loading />
        ) : (
          <>
            {properties?.length === 0 ? (
              <h1 className={`${styles.titulo} text-center`}>
                Al parecer aún no tienes ningún inmueble
              </h1>
            ) : (
              <>
                <div className={`${styles.colorTotal} d-flex justify-content-end`}>
                    TOTAL: {total}
                </div>
                {properties && properties.map((inmueble:any, key: number) => (
                  <PropertiesCard
                    key           = {key}
                    id            = {inmueble._id}
                    slug          = {inmueble.slug}
                    title         = {inmueble.titulo}
                    imgs          = {inmueble.imgs}
                    isActive      = {inmueble.publicado}
                    isFollower    = {true}
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

export default MyPropertiesFollowers;
