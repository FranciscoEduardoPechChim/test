//React
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { ChangeEvent } from 'react';
//Stylist 
import style from './Form.module.css';

interface Props {
    action:                     string;
    typeNotification:           any;
    typeEmail:                  any;
    data:                       any;
    selectNotification:         boolean;
    selectEmail:                boolean;
    errorNotification:          any;
    errorEmail:                 any;
    modalClose:                 () => void;
    handleSelectNotification:   (input: boolean) => void;
    handleSelectEmail:          (input: boolean) => void;
}

const FormFollower      = ({action, typeNotification, typeEmail, data, selectNotification, selectEmail, errorEmail, errorNotification, modalClose, handleSelectNotification, handleSelectEmail}:Props) => {
    
    const fullname      = (action != 'create') ? (data.owner.nombre + ' ' + data.owner.apellido):'';
    const email         = (action != 'create') ? data.owner.correo:'';

    return (
        <Container>
                <Row >
                    <Col md={6} sm xs={12} className='my-2'>
                        <Form.Group>
                            <Form.Label className={style.modalLabels} htmlFor="fullname">Asesor seguido</Form.Label>
                            <Form.Control defaultValue={fullname} id="fullname" type="text" name="fullname" maxLength={255} placeholder="Jhon Miller" disabled/>
                        </Form.Group>
                    </Col>
                    <Col md={6} sm xs={12} className='my-2'>
                        <Form.Group>
                            <Form.Label className={style.modalLabels} htmlFor="email">Correo electrónico</Form.Label>
                            <Form.Control defaultValue={email} id="email" type="text" name="email" maxLength={255} placeholder="jhon@example.com" disabled/>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6} sm xs={12} className='my-2'>
                        <Form.Group>
                            <Form.Label className={style.modalLabels} htmlFor="byNotification">Por notificación*</Form.Label>
                            {action && (action != 'show') &&
                                <Form.Select 
                                    id              = "byNotification"  
                                    value           = {(selectNotification) ? 1:0 }
                                    onChange        = {e => {
                                        handleSelectNotification((parseInt(e.target.value) == 1) ? true:false);
                                    }}
                                >
                                    {(typeNotification) && (typeNotification.length != 0) && typeNotification.map((value:any, key:any) => {
                                        return (<option key={key} value={value.id}>{value.name}</option>);        
                                    })}
                                </Form.Select>
                            }
                            {action && (action == 'show') &&
                                <Form.Select 
                                    id              = "byNotification"  
                                    value           = {(selectNotification) ? 1:0}
                                    disabled
                                    onChange        = {e => {
                                        handleSelectNotification((parseInt(e.target.value) == 1) ? true:false);
                                    }}
                                >
                                    {(typeNotification) && (typeNotification.length != 0) && typeNotification.map((value:any, key:any) => {
                                        return (<option key={key} value={value.id}>{value.name}</option>);        
                                    })}
                                </Form.Select>
                            }
                            
                        </Form.Group>   
                        {(errorNotification) && (errorNotification.length != 0) && errorNotification.map((value: any, key: any) => {
                            return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                        })}
                    </Col>
                    <Col md={6} sm xs={12} className='my-2'>
                        <Form.Group>
                            <Form.Label className={style.modalLabels} htmlFor="byEmail">Por correo electrónico*</Form.Label>
                            {action && (action != 'show') &&
                                <Form.Select 
                                    id              = "byEmail"  
                                    value           = {(selectEmail) ? 1:0}
                                    onChange        = {e => {
                                        handleSelectEmail((parseInt(e.target.value) == 1) ? true:false);
                                    }}
                                >
                                    {(typeEmail) && (typeEmail.length != 0) && typeEmail.map((value:any, key:any) => {
                                        return (<option key={key} value={value.id}>{value.name}</option>);        
                                    })}
                                </Form.Select>
                            }
                            {action && (action == 'show') &&
                                <Form.Select 
                                    id              = "byEmail"  
                                    value           = {(selectEmail) ? 1:0}
                                    disabled
                                    onChange        = {e => {
                                        handleSelectEmail((parseInt(e.target.value) == 1) ? true:false);
                                    }}
                                >
                                    {(typeEmail) && (typeEmail.length != 0) && typeEmail.map((value:any, key:any) => {
                                        return (<option key={key} value={value.id}>{value.name}</option>);        
                                    })}
                                </Form.Select>
                            }
                            
                        </Form.Group>   
                        {(errorEmail) && (errorEmail.length != 0) && errorEmail.map((value: any, key: any) => {
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

export default FormFollower;