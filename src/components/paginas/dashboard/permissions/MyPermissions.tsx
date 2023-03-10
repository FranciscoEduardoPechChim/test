//React
import { FormEvent, useContext, useState, useMemo, useEffect } from "react";
import { SelectChangeEvent } from '@mui/material/Select';
import { Container, Row, Col } from "react-bootstrap";
//Components
import FilterComponent from '../../../ui/filters/FilterComponent';
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
//Context
import { PermissionContext } from '../../../../context/permissions/PermissionContext';
//Hooks
import { usePermissions } from '../../../../hooks/usePermissions';
//Style
import styles from "./MyPermissions.module.css";
//Validations
import { isNotEmpty, isString, isLength } from '../../../../helpers/validations';

const MyListPermissions                                                             = () => {
    const access_token                                                              = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
    const { createPermission, editPermission, deletePermission, undeletePermission,
            showPermission }                                                        = useContext(PermissionContext);
    const [ filterText, setFilterText ]                                             = useState('');
    const [ selectAction, setSelectAction ]                                         = useState('');
    const [ selectId, setSelectId ]                                                 = useState('');
    const [ actions, setActions ]                                                   = useState('create');
    const [ modalShow, setModalShow ]                                               = useState(false);
    const [ errorName, setErrorName ]                                               = useState([]);
    const [ errorLabel, setErrorLabel ]                                             = useState([]);
    const [ errorDescription, setErrorDescription ]                                 = useState([]);
    const [ data, setData ]                                                         = useState({});
    const { loadings, permissions, init }                                           = usePermissions((access_token) ? access_token:'');
    
    const INITIAL_STATE                                                             = {
        name:                                                                       '',
        label:                                                                      '',
        description:                                                                ''
    }

    const { formulario, handleChange, reset, length, setLength, setFormulario }     = useForm(INITIAL_STATE);
    const { name, label, description }                                              = formulario;

    const columns = [
        {
            name:       'Nombre',
            selector:   (row:any) => row.name,
            sortable:   true
        },
        {
            name:       'Etiqueta',
            selector:   (row:any) => row.label,
            sortable:   true
        },
        {
            name:       'Descripci??n',
            selector:   (row:any) => (row.description) ? row.description:'Sin descripci??n',
            sortable:   true
        },
        {
            name:       'Estado',
            se??ectr:    (row:any) => row.deleted,
            sortable:   true,
            cell:       (row:any) => <span>{(row.deleted) ? 'Inactivo':'Activo'}</span>
        },
        {
            name:       'Acciones',
            selector:   (row:any) => row.actions,
            cell:       (row:any) => <ActionComponent actions={(!row.deleted) ? ['show', 'edit', 'delete']:['restore']} selectAction={selectAction} selectId={selectId} id={row._id} handleChange={(event: SelectChangeEvent, id: string) => handleChangeEvent(event, id)} />,
        },
    ];

    const paginationComponentOptions                                                = {
        rowsPerPageText: 'Cantidad',
        rangeSeparatorText: '-',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
    };

    const filteredItems                                                             = permissions.filter((item:any) => {
        return ((item.name && item.name.toLowerCase().includes(filterText.toLowerCase())) 
            || (item.label && item.label.includes(filterText.toLowerCase())) 
            || (item.description && item.description.includes(filterText.toLowerCase())))
    });

    const subHeaderComponentMemo                                                    = useMemo(() => {
		return (
            <FilterComponent onFilter={(e:any) => setFilterText(e.target.value)} filterText={filterText} />
		);
	}, [filterText]);

    const getPermission                                                             = async (id: string, access_token: string, value: any) => {
        const response                                                              = await showPermission(id, access_token);

        if(response) {     
            setFormulario({
                name:           response.name,
                label:          response.label,
                description:    (response.description) ? response.description:'',
            });
       
            setLength((response.description) ? (response.description.length):0);
            setData(response);
            setActions(value);
            setModalShow(true);
        }
    }

    const formValidate                                                              = (name: string, message: any) => {

        const messageError                                                          = message.filter((value:any) => value != '');
    
        if(messageError.length == 0) {
          return false;
        }
    
        switch(name) {
          case 'name':
            setErrorName(messageError);
          return true;
          case 'label':
            setErrorLabel(messageError);
          return true;
          case 'description':
            setErrorDescription(messageError);
          return true;
          default:
          return true;
        }
    }

    const handleChangeEvent                                                         = async (event: SelectChangeEvent, id: string) => {
        if(event && id && access_token) {
         
            switch(event.target.value) {
                case 'show':
                    getPermission(id, access_token, event.target.value);
                break;
                case 'edit':
                    getPermission(id, access_token, event.target.value);
                break;
                case 'delete':
                    const deleteResponse                                            = await deletePermission(id, access_token);

                    if(deleteResponse) {
                        init();
                        modalClose();
                    }
                break;
                case 'restore':
                    const restoreResponse                                           = await undeletePermission(id, access_token);
                    if(restoreResponse) {
                        init();
                        modalClose();
                    }
                break;
            }

            setSelectId(id);
            setSelectAction(event.target.value);
        }
    }

    const handleCreate                                                              = async () => {
        setActions('create');
        setLength(0);
        setModalShow(true);
    }

    const modalClose                                                                = () => {
        setErrorName([]); setErrorLabel([]); setErrorDescription([]);
        setSelectAction('');
        reset();
        setData({});
        setModalShow(false);
    }

    const onSubmit                                                                  = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrorName([]); setErrorLabel([]); setErrorDescription([]); 

        const formName                                                              = formValidate('name', [isNotEmpty(name), isString(name)]);
        const formLabel                                                             = formValidate('label', [isNotEmpty(label), isString(label)]);
        const formDescription                                                       = formValidate('description', [isLength(0, 255, (description) ? description:'')]);
    
        if(formName || formLabel || formDescription ) {
            return false;
        }
        
        if(access_token) {
            const isValid                                                           = (actions == 'create') ? 
                await createPermission(name, label, (description != '') ? description:null, access_token):
                await editPermission(selectId, name, label, (description != '') ? description:null, access_token);
        
            if(isValid) {
                init();
                modalClose();
            }
        }
    }    

    return (
        <>
            <Container>
                <Row>
                    <Card className="my-5">
                        <Row>
                            <Col className="mt-3 mx-2" xs={6}>
                                <Button
                                    titulo  = "A??adir"
                                    btn     = "Green"
                                    onClick = {handleCreate}
                                />
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <DataTable
                                columns                     = {columns}
                                data                        = {filteredItems}
                                sortIcon                    = {<SortIcon />}
                                noDataComponent             = {<span className='my-4'>Al parecer a??n no tienes ning??n permiso</span>}
                                pagination 
                                paginationComponentOptions  = {paginationComponentOptions}
                                subHeader
                                subHeaderComponent          = {subHeaderComponentMemo}
                                persistTableHead
                                progressPending             = {loadings} 
                                progressComponent           = {<Loading />}
                            />
                        </Row>
                    </Card>
                </Row>
            </Container>
            <PathModal 
                title                       = {'Permisos'}
                routeName                   = {'permissions'}
                modalShow                   = {modalShow}
                onSubmit                    = {onSubmit}
            >
                <FormPermission 
                    action                  = {actions}
                    data                    = {data}
                    descriptionLength       = {length}
                    errorName               = {errorName}
                    errorLabel              = {errorLabel}
                    errorDescription        = {errorDescription} 
                    modalClose              = {modalClose}
                    handleChange            = {handleChange}
                />
            </PathModal>
        </>
    );
};

export default MyListPermissions;
