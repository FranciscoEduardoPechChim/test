//React
import { Container, Row, Col, Form, Button, FloatingLabel } from 'react-bootstrap';
import { ChangeEvent } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import { Box, OutlinedInput, InputLabel, MenuItem, FormControl, Select, SelectChangeEvent, Chip } from '@mui/material';
//Stylist 
import style from './Form.module.css';

interface Props {
    action:                     string;
    roleId:                     string;    
    permissionId:               any;
    selectRoles:                any;
    selectPermissions:          any;
    errorRoleId:                any;
    errorPermissionId:          any;
    modalClose:                 () => void;
    handleChangeSelect:         (input: string) => void;
    handleChangeSelectMulti:    (event: SelectChangeEvent<any>) => void;
}

const FormRoleByPermission    = ({action, selectRoles, selectPermissions, modalClose, permissionId, roleId, errorRoleId, errorPermissionId, handleChangeSelect, handleChangeSelectMulti}:Props) => {
    const theme               = useTheme();

    const MenuProps           = {
        PaperProps: {
          style: {
            maxHeight: 48 * 4.5 + 8,
            width: 250,
          },
        },
    };

    function getStyles(id: string, permission: readonly string[], theme: Theme) {
        return {
          fontWeight:
            permission.indexOf(id) === -1
              ? theme.typography.fontWeightRegular
              : theme.typography.fontWeightMedium,
        };
    }

    return (
        <Container>
                <Row >
                    <Col md={6} sm xs={12} className='my-2'>
                        <Form.Group>
                            <Form.Label className={style.modalLabels} htmlFor="roleId">Rol*</Form.Label>
                            {action && (action != 'show') &&
                                <Form.Select 
                                    id              = "roleId"  
                                    value           = {roleId}
                                    style           = {{height: 55}}
                                    onChange        = {e => {
                                        handleChangeSelect(e.target.value);
                                    }}
                                >
                                    {action && (action != 'show') &&
                                        <option value={''} disabled>Seleccionar tipo</option>
                                    }
                                    {(selectRoles) && (selectRoles.length != 0) && selectRoles.map((value:any, key:any) => {
                                        return (<option key={key} value={value._id}>{value.role}</option>);        
                                    })}
                                </Form.Select>
                            }
                            {action && (action == 'show') &&
                                <Form.Select 
                                    id              = "roleId"  
                                    value           = {roleId}
                                    style           = {{height: 55}}
                                    disabled
                                    onChange        = {e => {
                                        handleChangeSelect(e.target.value);
                                    }}
                                >
                                    {action && (action != 'show') &&
                                        <option value={''} disabled>Seleccionar tipo</option>
                                    }
                                    {(selectRoles) && (selectRoles.length != 0) && selectRoles.map((value:any, key:any) => {
                                        return (<option key={key} value={value._id}>{value.role}</option>);        
                                    })}
                                </Form.Select>
                            }
                            
                        </Form.Group>   
                        {(errorRoleId) && (errorRoleId.length != 0) && errorRoleId.map((value: any, key: any) => {
                            return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                        })}
                    </Col>
                    <Col md={6} sm xs={12} className='my-2'>
                        <Form.Group>
                            <Form.Label className={style.modalLabels} htmlFor="label">Etiquetas*</Form.Label>
                            
                            <Row >
                                <Col md sm xs={12}>
                                    {action && (action != 'show') &&
                                        <Select
                                            id            = "demo-multiple-chip"
                                            multiple
                                            style         = {{width: '100%'}}
                                            value         = {permissionId}
                                            onChange      = {handleChangeSelectMulti}
                                            input         = {<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                            renderValue   = {(selected:any) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value:any) => (
                                                    <Chip key={value} label={value} />
                                                ))}
                                                </Box>
                                            )}
                                            MenuProps={MenuProps}
                                            >
                                            {selectPermissions.map((item:any) => {
                                                return (
                                                    <MenuItem
                                                        key   = {item._id}
                                                        value = {item.name}
                                                        style = {getStyles(item._id, item.name, theme)}
                                                        >
                                                        {item.name}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    }
                                    {action && (action == 'show') &&
                                        <Select
                                            id            = "demo-multiple-chip"
                                            multiple
                                            disabled
                                            style         = {{width: '100%'}}
                                            value         = {permissionId}
                                            onChange      = {handleChangeSelectMulti}
                                            input         = {<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                            renderValue   = {(selected:any) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value:any) => (
                                                    <Chip key={value} label={value} />
                                                ))}
                                                </Box>
                                            )}
                                            MenuProps={MenuProps}
                                            >
                                            {selectPermissions.map((item:any) => {
                                                return(
                                                    <MenuItem
                                                        key   = {item._id}
                                                        value = {item.name}
                                                        style = {getStyles(item.id, item.name, theme)}
                                                        >
                                                        {item.name}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    }   
                                </Col>
                            </Row>
                        </Form.Group>
                        {(errorPermissionId) && (errorPermissionId.length != 0) && errorPermissionId.map((value: any, key: any) => {
                            return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                        })}
                    </Col>
                </Row>
                <Row className='mt-5 mb-4'>
                    <Col className='d-flex justify-content-end' md sm xs={12}>
                        {action && (action != 'show') &&
                            <Button type="submit" variant="success">Guardar</Button>
                        }
                        {action && (action != 'show') &&
                            <Button className='mx-1' type="reset" variant="danger" onClick={() => modalClose()}>Cancelar</Button>
                        }
                        {action && (action == 'show') &&
                            <Button className='mx-1' type="reset" variant="outline-secondary" onClick={() => modalClose()}>Cerrar</Button>
                        }

                    </Col>
                </Row>
        </Container>
    );
}   

export default FormRoleByPermission;