//React
import { FormEvent, useContext, useState, useMemo, useEffect } from "react";
import { SelectChangeEvent } from '@mui/material/Select';
import { Container, Row, Col } from "react-bootstrap";
//Components
import FormRoleByPermission from '../../../ui/forms/FormRoleByPermission';
import ActionComponent from '../../../ui/actions/Actions';
import PathModal from '../../../ui/authmodal/PathModal';
import SortIcon from '@material-ui/icons/ArrowDownward';
import { useForm } from '../../../../hooks/useForm';
import DataTable from 'react-data-table-component';
import Loading from '../../../ui/loading/Loading';
import Button from "../../../ui/button/Button";
import Card from '@material-ui/core/Card';
//Context
import { RoleByPermissionContext } from '../../../../context/rolebypermissions/RoleByPermissionContext';
import { PermissionContext } from '../../../../context/permissions/PermissionContext';
//Hooks
import { useRoleByPermissions } from '../../../../hooks/useRoleByPermissions';
//Style
import styles from "./MyRoleByPermissions.module.css";
//Validations
import { isNotEmpty } from '../../../../helpers/validations';

const MyListRoleByPermissions                                                       = () => {
    const access_token                                                              = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
    const { createRoleByPermission, editRoleByPermission, deleteRoleByPermission, 
            showRoleByPermission, undeleteRoleByPermission }                        = useContext(RoleByPermissionContext);
    const { showPermissionByRole }                                                  = useContext(PermissionContext);
    const [ selectAction, setSelectAction ]                                         = useState('');
    const [ selectId, setSelectId ]                                                 = useState('');
    const [ actions, setActions ]                                                   = useState('create');
    const [ modalShow, setModalShow ]                                               = useState(false);
    const [ errorRoleId, setErrorRoleId ]                                           = useState([]);
    const [ errorPermissionId, setErrorPermissionId ]                               = useState([]);
    const [ permissionTagsKey, setPermissionTagsKey ]                               = useState<any[]>([]);
    const [ permissionTags, setPermissionTags ]                                     = useState<string[]>([]);
    const [ permissions, setPermissions ]                                           = useState<any>([]);
    const [ selectRole, setSelectRole ]                                             = useState('');
    const { loadings, roleByPermissions, roles, init, edit, updateRoles }           = useRoleByPermissions((access_token) ? access_token:'');

    const columns = [
        {
            name:       'Roles',
            selector:   (row:any) => row.roles,
            sortable:   true
        },
        {
            name:       'Permisos',
            selector:   (row:any) => {
                if(!row.deleted) {
                    for(let i=0; i < row.permissions.length; i++) {
                        if(!row.permissions[i].deleted) {
                            return row.permissions[0].permissionName + '...';
                        }
                    }
                }

                return row.permissions[0].permissionName + '...'; 
            },
            sortable:   true
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
    }

    const getRoleByPermission                                                       = async (id: string, access_token: string, value: any) => {
        const response                                                              = await showRoleByPermission(id, access_token);
        const responsePermission                                                    = await showPermissionByRole((response) ? response._id:'', access_token);
        const resultName                                                            = [];  
        const resultKey                                                             = [];

        await edit((response) ? response._id:'');

        if(response && responsePermission) {
            setPermissions(responsePermission);
            setSelectRole(response._id);
    
            for(let i=0; i < response.permissions.length; i++) {
                if(!response.permissions[i].deleted){
                    resultKey.push(response.permissions[i].permissionId);
                    resultName.push(response.permissions[i].permissionName);
                }
            }
               
            setPermissionTagsKey(resultKey);
            setPermissionTags(resultName);
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
          case 'roleId':
            setErrorRoleId(messageError);
          return true;
          case 'permissionId':
            setErrorPermissionId(messageError);
          return true;
          default:
          return true;
        }
    }

    const handleChangeEvent                                                         = async (event: SelectChangeEvent, id: string) => {
        if(event && id && access_token) {
         
            switch(event.target.value) {
                case 'show':
                    getRoleByPermission(id, access_token, event.target.value);
                break;
                case 'edit':
                    getRoleByPermission(id, access_token, event.target.value);
                break;
                case 'delete':
                    const deleteResponse                                            = await deleteRoleByPermission(id, access_token);

                    if(deleteResponse) {
                        init();
                        modalClose();
                    }
                break;
                case 'restore':
                    const restoreResponse                                           = await undeleteRoleByPermission(id, access_token);
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
        setModalShow(true);
    }

    const modalClose                                                                = () => {
        setErrorRoleId([]); setErrorPermissionId([]); 
        setSelectAction('');
        setSelectRole('');
        setPermissionTags([]);
        setPermissionTagsKey([]);
        setPermissions([]);
        updateRoles();
        setModalShow(false);
    }

    const handleChangeSelectMulti                                                   = (event: SelectChangeEvent<typeof permissionTags>) => {
        const {target: { value }}                                                   = event;
        const permissionArray                                                       = (typeof value === 'string') ? value.split(',') : value;
        const result                                                                = [];

        for(let i=0; i< permissions.length; i++) {
            if(permissionArray.includes(permissions[i].name)) {
                result.push(permissions[i]._id);
            }
        }

        setPermissionTagsKey(result);
        setPermissionTags(permissionArray);
    }

    const handleChangeSelect                                                        = async (input: any) => { 
        if(input && access_token) {
            const response                                                          = await showPermissionByRole(input, access_token);

            setPermissions(response);
            setSelectRole(input);
        }
    }

    const onSubmit                                                                  = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrorRoleId([]); setErrorPermissionId([]); 

        const formRoles                                                             = formValidate('roleId', [isNotEmpty(selectRole)]);
        const formPermissions                                                       = formValidate('permissionId', [isNotEmpty(permissionTagsKey)]);

        if(formRoles || formPermissions ) {
            return false;
        }
        
        if(access_token) {
            const isValid                                                           = (actions == 'create') ? 
                await createRoleByPermission(selectRole, permissionTagsKey.join(','), access_token):
                await editRoleByPermission(selectId, selectRole, permissionTagsKey.join(','), access_token);
        
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
                                    titulo  = "Añadir"
                                    btn     = "Green"
                                    onClick = {handleCreate}
                                />
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <DataTable
                                columns                     = {columns}
                                data                        = {roleByPermissions}
                                sortIcon                    = {<SortIcon />}
                                noDataComponent             = {<span className='my-4'>Al parecer aún no tienes ningún permiso</span>}
                                pagination 
                                paginationComponentOptions  = {paginationComponentOptions}
                                subHeader
                                persistTableHead
                                progressPending             = {loadings} 
                                progressComponent           = {<Loading />}
                            />
                        </Row>
                    </Card>
                </Row>
            </Container>
            <PathModal 
                title                       = {'Roles por permisos'}
                routeName                   = {'rolebypermissions'}
                modalShow                   = {modalShow}
                onSubmit                    = {onSubmit}
            >
                <FormRoleByPermission 
                    action                  = {actions}
                    roleId                  = {selectRole}
                    permissionId            = {permissionTags}
                    selectRoles             = {roles}
                    selectPermissions       = {permissions}
                    errorRoleId             = {errorRoleId}
                    errorPermissionId       = {errorPermissionId}
                    modalClose              = {modalClose}
                    handleChangeSelect      = {handleChangeSelect}
                    handleChangeSelectMulti = {handleChangeSelectMulti}
                />
            </PathModal> 
        </>
    );
};

export default MyListRoleByPermissions;
