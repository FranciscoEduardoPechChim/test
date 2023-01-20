//React
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FormEvent, useContext, useState, useMemo, useEffect } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Container, Row, Col, Form } from "react-bootstrap";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
//Components
import FilterComponent from '../../../ui/filters/FilterComponent';
import TablePagination from '@material-ui/core/TablePagination';
import FormPermission from '../../../ui/forms/FormPermission';
import ActionComponent from '../../../ui/actions/Actions';
import PathModal from '../../../ui/authmodal/PathModal';
import SortIcon from '@material-ui/icons/ArrowDownward';
import { useForm } from '../../../../hooks/useForm';
import DataTable from 'react-data-table-component';
import Loading from '../../../ui/loading/Loading';
import Button from "../../../ui/button/Button";
import Card from '@material-ui/core/Card';
import dayjs, { Dayjs } from 'dayjs';
//Hooks
import { usePaquetes } from 'hooks/usePaquetes';
import { useUsers } from '../../../../hooks/useUserInfo';
import { useProperties } from '../../../../hooks/useInmuebles';
//Style
import styles from "./Users.module.css";
//Extra
import 'dayjs/locale/es';

const Users                                                                         = () => {
    const access_token                                                              = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
    const [offset, setOffset]                                                       = useState(0);
    const [limit, setLimit]                                                         = useState(5);
    const [page, setPage]                                                           = useState(0);
    const [rowsPerPage, setRowsPerPage]                                             = useState(5);
    const [showCard, setShowCard]                                                   = useState(false);
    const [ startDate, setStartDate ]                                               = useState<Dayjs | null>(null);
    const [ endDate, setEndDate ]                                                   = useState<Dayjs | null>(null);
    const { users, loading, total }                                                 = useUsers(offset, limit, startDate, endDate, access_token ? access_token:'');
    const { properties }                                                            = useProperties((access_token) ? access_token:'');
    const { paquetes, cargando }                                                    = usePaquetes(0);

    const handleChangePage                                                          = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);  
        setOffset(newPage * rowsPerPage);
    }

    const handleChangeRowsPerPage                                                   = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setLimit(parseInt(event.target.value));
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
        setOffset(0);
    }

    const handleDate                                                                = (type: string, date: Dayjs | null) => {
        if(type && date) {

            if(type == 'startDate') {
                setStartDate(date);
            }else{
                setEndDate(date);
            }
        }
    }
    
    const onChangeAction                                                            = async (id: string, type: string) => {
        if(id && type) {
            switch(type) {
                case 'show':
                    setShowCard(true);
                break;
                case 'login':
                break;
            }
            console.log(id);
            console.log(type);
        }
    }

    return (
        <Container className="my-3">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'es'}>
                <Row>
                    {loading ? 
                        <Loading />:
                    (users.length == 0) ? 
                        <h1 className={`${styles.titulo} text-center`}>
                            Al parecer aún no tienes ningún usuario
                        </h1>: 
                        <>
                            <div className="row mb-3">
                                <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-3 mb-sm-2 mb-md-1 mb-2">
                                    <div className="col-12">
                                        <div className={styles.contentDates}>Roles</div>
                                    </div>
                                    <div className="col-12 mt-1">
                                        <Form.Select aria-label="Default select example">
                                            <option value="0">Todos</option>
                                            
                                            {(paquetes && (paquetes.length != 0) && paquetes.map((item:any, key:number) => {
                                                return (<option key={key} value={item._id}>{item.nombre}</option>);
                                            }))}
                                        </Form.Select>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-3 mb-sm-2 mb-md-1 mb-2">
                                    <div className="col-12">
                                        <div className={styles.contentDates}>Tipo de paquete</div>
                                    </div>
                                    <div className="col-12 mt-1">
                                        <Form.Select aria-label="Default select example">
                                            <option value="0">Todos</option>
                                            
                                            {(paquetes && (paquetes.length != 0) && paquetes.map((item:any, key:number) => {
                                                return (<option key={key} value={item._id}>{item.nombre}</option>);
                                            }))}
                                        </Form.Select>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-3 mb-sm-2 mb-md-1 mb-2">
                                    <div className="col-12">
                                        <div className={styles.contentDates}>Estado</div>
                                    </div>
                                    <div className="col-12 mt-1">
                                        <Form.Select aria-label="Default select example">
                                            <option value="0">Todos</option>
                                            <option value="1">En linea</option>
                                            <option value="2">Desconectado</option>
                                        </Form.Select>
                                    </div>
                                </div>
                            </div>
                            <div className="row d-flex justify-content-end">
                                
                                <div className="col-2 mb-sm-2 mb-md-1 mb-2">
                                    <Form.Control type="text" placeholder="Buscar..." />
                                </div>
                                {/* <div className="col-sm-12 col-md-7 col-lg-7 col-xl-8"> */}
                                    {/* <div className="row">
                                        <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4 col-6 mb-3">
                                            <label className={styles.contentDates}>Desde</label>
                                            <DatePicker
                                                label       = ''
                                                value       = {startDate}
                                               
                                                inputFormat = 'DD-MM-YYYY'
                                                onChange    = {(newDate:any) => {
                                                    handleDate('startDate', newDate);
                                                }}
                                                maxDate     = {endDate}
                                                renderInput = {(params) => <TextField style={{ background: 'white'}} size="small" {...params} fullWidth/>}
                                            />
                                        </div>
                                        <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4 col-6 mb-3">
                                            <label className={styles.contentDates}>Hasta</label>
                                            <DatePicker
                                                label       = ''
                                                value       = {endDate}
                                                inputFormat = 'DD-MM-YYYY'
                                                onChange    = {(newDate:any) => {
                                                    handleDate('endDate', newDate);
                                                }}
                                                minDate     = {startDate}
                                                renderInput = {(params) => <TextField style={{ background: 'white'}} size="small" {...params} fullWidth/>}
                                            />
                                        </div>
                                    </div>  */}
                                   
                                {/* </div>  */}
                                {/* <div className="col-sm-12 col-md-5 col-lg-5 col-xl-4">
                                    <div className={styles.totales}>
                                        <div className="row">
                                        <div className={`col-12 mb-2 ${styles.headR2}`}>
                                                <div className={`${styles.Ttitle}`}>
                                                    Filtros aplicados
                                                </div>
                                        </div>
                                        <div className="col-6 text-center mb-2">
                                                <div className={`${styles.CTlabel}`}>
                                                    Usuarios:
                                                </div>
                                                <div className={`${styles.CTuser}`}>
                                                    {total}
                                                </div>
                                        </div>
                                        <div className="col-6 text-center mb-2">
                                            <div className={`${styles.CTlabel}`}>
                                                Publicaciones:
                                            </div>
                                            <div className={`${styles.CTuser}`}>
                                                {properties.length}
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div> 
                  
                            <div className="row">
                                <div className="col-12 my-2">
                                    <div className={`${styles.tablaRef} table-responsive`}>
                                        <table className="w-100">
                                            <tr className={styles.rowT}>   
                                                <td className={styles.headersT}>Usuario</td>
                                                <td className={styles.headersT}>Correo electrónico</td>
                                                <td className={styles.headersT}>Teléfono</td>
                                                <td className={styles.headersT}>Rol</td>
                                                <td className={styles.headersT}>Acciones</td>
                                            </tr>
                                            {(users) && (users.length != 0) && users.map((item:any, key:number) => {
                                                const name      = item.nombre + item.apellido;
                                                const fullname  = (name.length <20) ? name:name.substr(0,20) + '...';

                                                return (
                                                    <tr key={key} className={styles.rowT}>
                                                        <td className={styles.contentT}>
                                                            {fullname}
                                                        </td>
                                                        <td className={styles.contentT}>
                                                            {item.correo}
                                                        </td>
                                                        <td className={styles.contentT}>
                                                            {(item.telefonoPersonal) ? item.telefonoPersonal:'Ninguno'}
                                                        </td>
                                                        <td className={styles.contentT}>
                                                            {item.role}
                                                        </td>
                                                        <td className={styles.contentT}>
                                                            <button className={`${styles.btnT1} px-2 mx-1 my-1`} onClick={() => onChangeAction(item.uid,'login')} >
                                                                <i className="bi bi-person" />
                                                            </button>
                                                            <button className={`${styles.btnT1} px-2 mx-1 my-1`} onClick={() => onChangeAction(item.uid,'show')} >
                                                                <i className="bi bi-eye" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </table>
                                        <TablePagination
                                            component             = "div"
                                            count                 = {total}
                                            page                  = {page}
                                            onPageChange          = {handleChangePage}
                                            rowsPerPage           = {rowsPerPage}
                                            onRowsPerPageChange   = {handleChangeRowsPerPage}
                                            rowsPerPageOptions    = {[5, 10, 20, 50, 100]}
                                            labelRowsPerPage      = {'Cantidad'}
                                            labelDisplayedRows    = {({ from, to, count }) => `${from}-${to} de ${count}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </Row>
            </LocalizationProvider>
        </Container>
        // <>
        
        //         {/* <section className="mt-5">
        //             <div className="container">
        //                 <div className={`${styles.filtros}`}>
        //                     <div className={`${styles.headR} p-2`}>
        //                         <div className="row">
        //                             <div className="col-6">
        //                                 <div className={`${styles.textHeadR}`}>
        //                                     Detalles de Usuario
        //                                 </div>
        //                             </div>
        //                             <div className="col-6 text-end">
        //                                 <button className={`${styles.btnProps}`}>
        //                                     Ver propiedades <i className="bi bi-caret-down-fill"></i>
        //                                 </button>
        //                             </div>
        //                         </div>
        //                     </div>
        //                     <div className="row p-2">
        //                         <div className="col-sm-12 col-md-12 col-lg-12 col-xl-2 mb-5">
        //                             <div className={styles.backprofile}>
        //                                 <img className={`${styles.imgProfile}`} src="/images/avatares/2.svg" alt="..." />
        //                             </div>
        //                         </div>
        //                         <div className="col-sm-12 col-md-12 col-lg-12 col-xl-10">
        //                             <div className="row">
        //                                 <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4">
        //                                     <div className="content mb-2">
        //                                         <div className={`${styles.etiqueta}`}>
        //                                             id:
        //                                         </div>
        //                                         <div className={`${styles.dato}`}>
        //                                             620fd8479d32c9541a3bb214
        //                                         </div>
        //                                     </div>
        //                                     <div className="content mb-2">
        //                                         <div className={`${styles.etiqueta}`}>
        //                                             nombre:
        //                                         </div>
        //                                         <div className={`${styles.dato}`}>
        //                                             Alvaro Salvador
        //                                         </div>
        //                                     </div>
        //                                     <div className="content mb-2">
        //                                         <div className={`${styles.etiqueta}`}>
        //                                             Correo:
        //                                         </div>
        //                                         <div className={`${styles.dato}`}>
        //                                             alsato.650cc@gmail.com
        //                                         </div>
        //                                     </div>
        //                                     <div className="content mb-2">
        //                                         <div className={`${styles.etiqueta}`}>
        //                                             telefono oficina:
        //                                         </div>
        //                                         <div className={`${styles.dato}`}>
        //                                             6686151651651651
        //                                         </div>
        //                                     </div>
        //                                     <div className="content mb-2">
        //                                         <div className={`${styles.etiqueta}`}>
        //                                             telefono personal:
        //                                         </div>
        //                                         <div className={`${styles.dato}`}>
        //                                             6686151651651651
        //                                         </div>
        //                                     </div>
        //                                     <div className="content mb-2">
        //                                         <div className={`${styles.etiqueta}`}>
        //                                             Rol:
        //                                         </div>
        //                                         <div className={`${styles.dato}`}>
        //                                             Administrador
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                                 <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4">
        //                                     <div className="content mb-2">
        //                                         <div className={`${styles.etiqueta}`}>
        //                                             Ubicación:
        //                                         </div>
        //                                         <div className={`${styles.dato}`}>
        //                                             Cancún, Q.ROO, MX
        //                                         </div>
        //                                     </div>
        //                                     <div className="content mb-2">
        //                                         <div className={`${styles.etiqueta}`}>
        //                                             Plan contratado:
        //                                         </div>
        //                                         <div className={`${styles.dato}`}>
        //                                             Avanzado
        //                                         </div>
        //                                     </div>
        //                                     <div className="content mb-2">
        //                                         <div className={`${styles.etiqueta}`}>
        //                                             Perfil empresarial:
        //                                         </div>
        //                                         <div className={`${styles.dato}`}>
        //                                             Lorem ipsum dolor, sit amet consectetur adipisicing elit.
        //                                             Reiciendis, nostrum? Est consectetur.
        //                                         </div>
        //                                     </div>
        //                                     <div className="content mb-2">
        //                                         <div className={`${styles.etiqueta}`}>
        //                                             Inmobiliaria:
        //                                         </div>
        //                                         <div className={`${styles.dato}`}>
        //                                             Real State 8
        //                                         </div>
        //                                     </div>
        //                                     <div className="content mb-2">
        //                                         <div className={`${styles.etiqueta}`}>
        //                                             Dueño de:
        //                                         </div>
        //                                         <div className={`${styles.dato}`}>
        //                                             6 usuarios
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                                 <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4">
        //                                     <div className="content mb-2">
        //                                         <div className={`${styles.etiqueta}`}>
        //                                             Sitio web:
        //                                         </div>
        //                                         <div className={`${styles.dato}`}>
        //                                             www.real-state8.com
        //                                         </div>
        //                                     </div>
        //                                     <div className="content mb-2">
        //                                         <div className={`${styles.etiqueta}`}>
        //                                             Facebook:
        //                                         </div>
        //                                         <div className={`${styles.dato}`}>
        //                                             facebook.com/alvaro.343
        //                                         </div>
        //                                     </div>
        //                                     <div className="content mb-2">
        //                                         <div className={`${styles.etiqueta}`}>
        //                                             Twitter:
        //                                         </div>
        //                                         <div className={`${styles.dato}`}>
        //                                             twitter.com/alvaro.343
        //                                         </div>
        //                                     </div>
        //                                     <div className="content mb-2">
        //                                         <div className={`${styles.etiqueta}`}>
        //                                             Instagram:
        //                                         </div>
        //                                         <div className={`${styles.dato}`}>
        //                                             instagram.com/alvaro.343
        //                                         </div>
        //                                     </div>
        //                                     <div className="content mb-2">
        //                                         <div className={`${styles.etiqueta}`}>
        //                                             LinkedIn:
        //                                         </div>
        //                                         <div className={`${styles.dato}`}>
        //                                             linkedin.com/alvaro.343
        //                                         </div>
        //                                     </div>
        //                                     <div className="content mb-2">
        //                                         <div className={`${styles.etiqueta}`}>
        //                                             Publicaciones:
        //                                         </div>
        //                                         <div className={`${styles.dato}`}>
        //                                             8
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </section> */}

        //         {/* <section className="mt-2 mb-5">
        //             <div className="container">
        //                 <div className={`${styles.props}`}>
        //                     <div className="row">
        //                         <div className="col-sm-12 col-md-12 col-lg-12 col-xl-6 mb-3">
        //                             <div className={`${styles.propbody}`}>
        //                                 <div className="row">
        //                                     <div className="col-sm-12 col-md-12 col-lg-4 pe-0">
        //                                         <img src="https://res.cloudinary.com/db91exuen/image/upload/v1649780878/red1a1/usuarios/624dc3b64c90f165a6fa07dc/inmuebles/6255a887ed442e8b7c2919de/dxzath7se4sqkghxleyb.jpg"
        //                                             alt="..."
        //                                             className={`${styles.imgprop}`}
        //                                         />
        //                                     </div>
        //                                     <div className="col-sm-12 col-md-12 col-lg-8">
        //                                         <div className={`${styles.propcontainer}`}>
        //                                             <div className={`${styles.propTitle} mb-1`}>
        //                                                 Hewlett Packard HQ
        //                                             </div>
        //                                             <div className={`${styles.propDesc} mb-1`}>
        //                                                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, et.
        //                                             </div>
        //                                             <div className="proplabels">
        //                                                 <div className="row">
        //                                                     <div className="col-6">
        //                                                         <span className={`${styles.pLabels} mx-1`}>Casas</span>
        //                                                         <span className={`${styles.pLabels} mx-1`}>Renta</span>
        //                                                     </div>
        //                                                     <div className="col-6 text-end">
        //                                                         <div className={`${styles.propPrice}`}>
        //                                                             $50,000
        //                                                         </div>
        //                                                     </div>
        //                                                 </div>
        //                                             </div>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                         <div className="col-sm-12 col-md-12 col-lg-12 col-xl-6 mb-3">
        //                             <div className={`${styles.propbody}`}>
        //                                 <div className="row">
        //                                     <div className="col-sm-12 col-md-12 col-lg-4 pe-0">
        //                                         <img src="https://res.cloudinary.com/db91exuen/image/upload/v1649780878/red1a1/usuarios/624dc3b64c90f165a6fa07dc/inmuebles/6255a887ed442e8b7c2919de/dxzath7se4sqkghxleyb.jpg"
        //                                             alt="..."
        //                                             className={`${styles.imgprop}`}
        //                                         />
        //                                     </div>
        //                                     <div className="col-sm-12 col-md-12 col-lg-8">
        //                                         <div className={`${styles.propcontainer}`}>
        //                                             <div className={`${styles.propTitle} mb-1`}>
        //                                                 Hewlett Packard HQ
        //                                             </div>
        //                                             <div className={`${styles.propDesc} mb-1`}>
        //                                                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, et.
        //                                             </div>
        //                                             <div className="proplabels">
        //                                                 <div className="row">
        //                                                     <div className="col-6">
        //                                                         <span className={`${styles.pLabels} mx-1`}>Casas</span>
        //                                                         <span className={`${styles.pLabels} mx-1`}>Renta</span>
        //                                                     </div>
        //                                                     <div className="col-6 text-end">
        //                                                         <div className={`${styles.propPrice}`}>
        //                                                             $50,000
        //                                                         </div>
        //                                                     </div>
        //                                                 </div>
        //                                             </div>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                         <div className="col-sm-12 col-md-12 col-lg-12 col-xl-6 mb-3">
        //                             <div className={`${styles.propbody}`}>
        //                                 <div className="row">
        //                                     <div className="col-sm-12 col-md-12 col-lg-4 pe-0">
        //                                         <img src="https://res.cloudinary.com/db91exuen/image/upload/v1649780878/red1a1/usuarios/624dc3b64c90f165a6fa07dc/inmuebles/6255a887ed442e8b7c2919de/dxzath7se4sqkghxleyb.jpg"
        //                                             alt="..."
        //                                             className={`${styles.imgprop}`}
        //                                         />
        //                                     </div>
        //                                     <div className="col-sm-12 col-md-12 col-lg-8">
        //                                         <div className={`${styles.propcontainer}`}>
        //                                             <div className={`${styles.propTitle} mb-1`}>
        //                                                 Hewlett Packard HQ
        //                                             </div>
        //                                             <div className={`${styles.propDesc} mb-1`}>
        //                                                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, et.
        //                                             </div>
        //                                             <div className="proplabels">
        //                                                 <div className="row">
        //                                                     <div className="col-6">
        //                                                         <span className={`${styles.pLabels} mx-1`}>Casas</span>
        //                                                         <span className={`${styles.pLabels} mx-1`}>Renta</span>
        //                                                     </div>
        //                                                     <div className="col-6 text-end">
        //                                                         <div className={`${styles.propPrice}`}>
        //                                                             $50,000
        //                                                         </div>
        //                                                     </div>
        //                                                 </div>
        //                                             </div>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </section> */}

        //         <section className="my-5 mx-2">
        //             <div className="container">
        //                 {/* <div className="row">
        //                     <div className="col-sm-12 col-md-7 col-lg-7 col-xl-8">
        //                         <div className="row">
        //                             <div className="col-sm-6 col-md-6 col-lg-4 col-xl-3 col-6 mb-3">
        //                                 <label><b>Desde:</b></label> <br />
        //                                 <input type="date" className="Dpicker" />
        //                             </div>
        //                             <div className="col-sm-6 col-md-6 col-lg-4 col-xl-3 col-6 mb-3">
        //                                 <label><b>Hasta:</b></label> <br />
        //                                 <input type="date" className="Dpicker" />
        //                             </div>
        //                         </div>
        //                         <div className="row">
        //                             <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-sm-2 mb-md-1 mb-2">
        //                                 <Form.Control type="text" placeholder="Buscar . . . " />
        //                             </div>
        //                             <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-sm-2 mb-md-1 mb-2">
        //                                 <Form.Select aria-label="Default select example">
        //                                     <option>Ubicación</option>
        //                                     <option value="1">Cancún, Q.Roo, MX</option>
        //                                     <option value="2">Merida, YUC, MX</option>
        //                                     <option value="3">CDMX, Mexico, MX</option>
        //                                     <option value="3">Tijuana, Baja California, MX</option>
        //                                     <option value="5">etc...</option>
        //                                 </Form.Select>
        //                             </div>
        //                             <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-sm-2 mb-md-1 mb-2">
        //                                 <Form.Select aria-label="Default select example">
        //                                     <option>Paquete adquirido</option>
        //                                     <option value="1">Individual</option>
        //                                     <option value="2">Basico</option>
        //                                     <option value="3">Intermedio</option>
        //                                     <option value="3">Avanzado</option>
        //                                 </Form.Select>
        //                             </div>
        //                         </div>
        //                     </div>
        //                     <div className="col-sm-12 col-md-5 col-lg-5 col-xl-4">
        //                         <div className={styles.totales}>
        //                             <div className="row">
        //                                 <div className={`col-12 mb-2 ${styles.headR2}`}>
        //                                     <div className={`${styles.Ttitle}`}>
        //                                         Filtros aplicados
        //                                     </div>
        //                                 </div>
        //                                 <div className="col-6 text-center mb-2">
        //                                     <div className={`${styles.CTlabel}`}>
        //                                         Usuarios:
        //                                     </div>
        //                                     <div className={`${styles.CTuser}`}>
        //                                         16
        //                                     </div>
        //                                 </div>
        //                                 <div className="col-6 text-center mb-2">
        //                                     <div className={`${styles.CTlabel}`}>
        //                                         Publicaciones:
        //                                     </div>
        //                                     <div className={`${styles.CTuser}`}>
        //                                         160
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div> */}


        //                 <div className="row">
        //                     <div className="col-12 my-2">
        //                         <div className={`${styles.tablaRef} table-responsive`}>
        //                             <div className={styles.headerRef}>
        //                                 Usuarios registrados
        //                             </div>
        //                             <table className="w-100">
        //                                 <tr className={styles.rowT}>
        //                                     {/* <td className={styleRef.headersT}>Id</td> */}
        //                                     <td className={styles.headersT}>Fecha</td>
        //                                     <td className={styles.headersT}>Usuario</td>
        //                                     <td className={styles.headersT}>Correo</td>
        //                                     <td className={styles.headersT}>Número</td>
        //                                     <td className={styles.headersT}>Paquete</td>
        //                                     <td className={styles.headersT}>Publ.</td>
        //                                     <td className={styles.headersT}>Ubicación</td>
        //                                     <td className={styles.headersT}></td>
        //                                 </tr>

        //                                 <tr className={styles.rowT}>
        //                                     {/* <td className={styleRef.contentT}>
        //                                         as65d6asd56asd1a65d
        //                                     </td> */}
        //                                     <td className={styles.contentT}>
        //                                         25/22/55
        //                                     </td>
        //                                     <td className={styles.contentT}>
        //                                         Alvaro Salvador Torruco
        //                                     </td>
        //                                     <td className={styles.contentT}>
        //                                         alvarosalvador.t@gmail.com
        //                                     </td>
        //                                     <td className={styles.contentT}>
        //                                         9984751570
        //                                     </td>
        //                                     <td className={styles.contentT}>
        //                                         Avanzado
        //                                     </td>
        //                                     <td className={styles.contentT}>
        //                                         25
        //                                     </td>
        //                                     <td className={styles.contentT}>
        //                                         Cancun, Q.Roo, MX
        //                                     </td>
        //                                     <td className={styles.contentT}>
        //                                         <button
        //                                             className={`${styles.btnT1} px-2 mx-1`}
        //                                         >
        //                                             <i className="bi bi-eye" />
        //                                         </button>
        //                                     </td>
        //                                 </tr>

        //                                 <tr className={styles.rowT}>
        //                                     {/* <td className={styleRef.contentT}>
        //                                         as65d6asd56asd1a65d
        //                                     </td> */}
        //                                     <td className={styles.contentT}>
        //                                         25/22/55
        //                                     </td>
        //                                     <td className={styles.contentT}>
        //                                         Alvaro Salvador Torruco
        //                                     </td>
        //                                     <td className={styles.contentT}>
        //                                         alvarosalvador.t@gmail.com
        //                                     </td>
        //                                     <td className={styles.contentT}>
        //                                         9984751570
        //                                     </td>
        //                                     <td className={styles.contentT}>
        //                                         Avanzado
        //                                     </td>
        //                                     <td className={styles.contentT}>
        //                                         25
        //                                     </td>
        //                                     <td className={styles.contentT}>
        //                                         Cancun, Q.Roo, MX
        //                                     </td>
        //                                     <td className={styles.contentT}>
        //                                         <button
        //                                             className={`${styles.btnT1} px-2 mx-1`}
        //                                         >
        //                                             <i className="bi bi-eye" />
        //                                         </button>
        //                                     </td>
        //                                 </tr>


        //                             </table>
        //                             {/* {referencias.length === 0 ? (
        //                                 <h2 className="text-center py-5">
        //                                     Aún no hay referencias
        //                                 </h2>
        //                             ) : null} */}
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </section>
        // </>
    );
};

export default Users;
