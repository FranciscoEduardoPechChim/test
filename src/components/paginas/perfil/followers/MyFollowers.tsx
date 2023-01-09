//React
import React, { useContext, useState, useMemo, FormEvent } from 'react'
import { SelectChangeEvent } from '@mui/material/Select';
import SortIcon from '@material-ui/icons/ArrowDownward';
import { Container, Row, Col } from "react-bootstrap";
import Card from '@material-ui/core/Card';
import styles from './Follower.module.css'
//Hooks
import { useFollowers } from '../../../../hooks/useFollowers';
import { useForm } from '../../../../hooks/useForm';
//Context
import { AuthContext } from 'context/auth/AuthContext';
import { FollowerContext } from 'context/followers/FollowerContext';
//Components
import FilterComponent from '../../../ui/filters/FilterComponent';
import FormFollower from '../../../ui/forms/FormFollower';
import ActionComponent from '../../../ui/actions/Actions';
import PathModal from '../../../ui/authmodal/PathModal';
import DataTable from 'react-data-table-component';
import Loading from '../../../ui/loading/Loading';
//Validations
import { isNotEmpty, isBoolean } from '../../../../helpers/validations';

const MyFollowers                                           = () => {
    const access_token                                      = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
    const { auth }                                          = useContext(AuthContext);
    const { createFollower, editFollower, deleteFollower, 
        showFollower }                                      = useContext(FollowerContext);

    const [ filterText, setFilterText ]                     = useState('');
    const [ selectAction, setSelectAction ]                 = useState('');
    const [ selectId, setSelectId ]                         = useState('');
    const [ actions, setActions ]                           = useState('create');
    const [ modalShow, setModalShow ]                       = useState(false);
    const [ errorNotification, setErrorNotification ]       = useState([]);
    const [ errorEmail, setErrorEmail ]                     = useState([]);
    const [ data, setData ]                                 = useState({});
    const [ selectNotification, setSelectNotification ]     = useState<boolean>(true);
    const [ selectEmail, setSelectEmail ]                   = useState<boolean>(true);
    const [ owner, setOwner]                                = useState('');
    const { loading, followers, init }                      = useFollowers((auth && auth.uid) ? auth.uid:'', (access_token) ? access_token:'');

    const columns = [
        {
            name:       'Asesor inmobiliario',
            selector:   (row:any) => row.owner.nombre + ' ' + row.owner.apellido,
            sortable:   true
        },
        {
            name:       'Correo electrónico',
            selector:   (row:any) => row.owner.correo,
            sortable:   true
        },
        {
            name:       'Por notificaciones',
            selector:   (row:any) => (row.notification) ? 'Si':'No',
            sortable:   true
        },
        {
            name:       'Por correo electrónico',
            selector:   (row:any) => (row.email) ? 'Si':'No',
            sortable:   true
        },
        {
            name:       'Acciones',
            selector:   (row:any) => row.actions,
            cell:       (row:any) => <ActionComponent actions={['show', 'edit', 'delete']} selectAction={selectAction} selectId={selectId} id={row._id} handleChange={(event: SelectChangeEvent, id: string) => handleChangeEvent(event, id)} />,
        },
    ];

    const paginationComponentOptions                        = {
        rowsPerPageText: 'Cantidad',
        rangeSeparatorText: '-',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
    };

    const filteredItems                                     = followers.filter((item:any) => {
        return ((item.owner.nombre && item.owner.nombre.toLowerCase().includes(filterText.toLowerCase()))    
            || (item.owner.apellido && item.owner.apellido.toLowerCase().includes(filterText.toLowerCase()))
            || (item.owner.correo && item.owner.correo.toLowerCase().includes(filterText.toLowerCase())))
    });

    const subHeaderComponentMemo                            = useMemo(() => {
		return (
            <div className='my-2'>
                <FilterComponent onFilter={(e:any) => setFilterText(e.target.value)} filterText={filterText} />
            </div>
        );
	}, [filterText]);

    const getFollower                                       = async (id: string, access_token: string, value: any) => {
        const response                                      = await showFollower(id, access_token);
        
        if(response) {          
            setSelectNotification(response.notification);
            setSelectEmail(response.email);
            setOwner((response.owner && (typeof response.owner.uid == 'string')) ? response.owner.uid:'');
            setData(response);
            setActions(value);
            setModalShow(true);
        }
    }

    const formValidate                                      = (name: string, message: any) => {

        const messageError                                  = message.filter((value:any) => value != '');
    
        if(messageError.length == 0) {
          return false;
        }

        switch(name) {
          case 'notification':
            setErrorNotification(messageError);
          return true;
          case 'email':
            setErrorEmail(messageError);
          return true;
          default:
          return true;
        }
    }

    const handleChangeEvent                                 = async (event: SelectChangeEvent, id: string) => {
        if(event && id && access_token) {
         
            switch(event.target.value) {
                case 'show':
                    getFollower(id, access_token, event.target.value);
                break;
                case 'edit':
                    getFollower(id, access_token, event.target.value);
                break;
                case 'delete':
                    const deleteResponse                    = await deleteFollower(id, access_token);

                    if(deleteResponse) {
                        init();
                        modalClose();
                    }
                break;
            }

            setSelectId(id);
            setSelectAction(event.target.value);
        }
    }

    const modalClose                                        = () => {
        setErrorNotification([]); setErrorEmail([]); 
        setSelectNotification(true);
        setSelectEmail(true);
        setOwner('');
        setSelectAction('');
        // setData({});
        setModalShow(false);
    }

    const onSubmit                                          = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrorNotification([]); setErrorEmail([]); 

        const formNotification                              = formValidate('notification', [isBoolean(selectNotification)]);
        const formEmail                                     = formValidate('email', [isBoolean(selectEmail)]);

        if(formNotification || formEmail ) {
            return false;
        }

        if((auth && auth.uid) && owner && selectId && access_token) {
            const isValid                                   = await editFollower(selectId, auth.uid, owner, selectNotification, selectEmail, access_token);
        
            if(isValid) {
                init();
                modalClose();
            }
        }
    }    

    return (
        <>
            <Container>
                <Row className='mt-2'>
                    <Col>
                        <h2>Asesores seguidos</h2>
                    </Col>
                </Row>
                <Row>              
                    <Card className="my-5">
                        <Row className="justify-content-center">
                            <DataTable
                                columns                     = {columns}
                                data                        = {filteredItems}
                                sortIcon                    = {<SortIcon />}
                                noDataComponent             = {<span className='my-4'>Al parecer aún no tienes ningún asesor</span>}
                                pagination 
                                paginationComponentOptions  = {paginationComponentOptions}
                                subHeader
                                subHeaderComponent          = {subHeaderComponentMemo}
                                persistTableHead
                                progressPending             = {loading} 
                                progressComponent           = {<Loading />}
                            />
                        </Row>
                    </Card>
                </Row>
            </Container>
            <PathModal 
                title                       = {'Siguiendo'}
                routeName                   = {'followers'}
                modalShow                   = {modalShow}
                onSubmit                    = {onSubmit}
            >
                <FormFollower 
                    action                  = {actions}
                    data                    = {data}
                    typeNotification        = {[{id: 1 , name: 'Si'},{id: 0, name:'No'}]}
                    typeEmail               = {[{id: 1 , name: 'Si'},{id: 0, name:'No'}]}
                    selectNotification      = {selectNotification}
                    selectEmail             = {selectEmail}
                    errorNotification       = {errorNotification}
                    errorEmail              = {errorEmail}
                    modalClose              = {modalClose}
                    handleSelectNotification= {setSelectNotification}
                    handleSelectEmail       = {setSelectEmail}
                />
            </PathModal>
        </>
    );
}

export default MyFollowers;
