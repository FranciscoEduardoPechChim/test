//React
import { Container, Row, Col, Form, Button, FloatingLabel } from 'react-bootstrap';
import { ChangeEvent } from 'react';
//Stylist 
import style from './Form.module.css';

interface Props {
    action:             string;
    data:               any;
    descriptionLength:  number;
    errorName:          any;
    errorLabel:         any;
    errorDescription:   any;
    modalClose:         () => void;
    handleChange:       ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const FormPermission    = ({action, handleChange, data, descriptionLength, modalClose, errorName, errorLabel, errorDescription}:Props) => {
    
    const name          = (action != 'create') ? data.name:'';
    const label         = (action != 'create') ? data.label:'';
    const description   = (action != 'create') ? data.description:'';
  
    return (
        <Container>
                <Row >
                    <Col md={6} sm xs={12} className='my-2'>
                        <Form.Group>
                            <Form.Label className={style.modalLabels} htmlFor="name">Nombre*</Form.Label>

                            {action && (action != 'show') &&
                                <Form.Control defaultValue={name} id="name" type="text" name="name" maxLength={255} placeholder="Profile" onChange={handleChange} />
                            }
                            {action && (action == 'show') &&
                                <Form.Control defaultValue={name} id="name" type="text" name="name" maxLength={255} placeholder="Profile" onChange={handleChange} disabled/>
                            }
                        </Form.Group>
                        {(errorName) && (errorName.length != 0) && errorName.map((value: any, key: any) => {
                            return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                        })}
                    </Col>
                    <Col md={6} sm xs={12} className='my-2'>
                        <Form.Group>
                            <Form.Label className={style.modalLabels} htmlFor="label">Etiqueta*</Form.Label>

                            {action && (action != 'show') &&
                                <Form.Control defaultValue={label} id="label" type="text" name="label" maxLength={255} placeholder="admin.profile" onChange={handleChange} />
                            }
                            {action && (action == 'show') &&
                                <Form.Control defaultValue={label} id="label" type="text" name="label" maxLength={255} placeholder="admin.profile" onChange={handleChange} disabled/>
                            }
                        </Form.Group>
                        {(errorLabel) && (errorLabel.length != 0) && errorLabel.map((value: any, key: any) => {
                            return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                        })}
                    </Col>
                </Row>
                <Row>
                    <Col md sm xs={12} className='my-2'>
                        <Form.Group>
                            <Form.Label className={style.modalLabels} htmlFor="description">Descripción</Form.Label>
                            <FloatingLabel
                                label       = ""
                            >
                                {action && (action != 'show') &&
                                    <Form.Control defaultValue={description} id="description" as="textarea" type="text" name="description" maxLength={255} placeholder="The profile is..." onChange={handleChange} style={{ height: '150px', resize: 'none' }}/>
                                }
                                {action && (action == 'show') &&
                                    <Form.Control defaultValue={description} id="description" as="textarea" type="text" name="description" maxLength={255} placeholder="The profile is..." onChange={handleChange} style={{ height: '150px', resize: 'none' }} disabled/>
                                }
                            </FloatingLabel>
                            
                            <div className="d-flex justify-content-end">
                                <span className={style.modalLabels}>{descriptionLength} - 255</span>
                            </div>
                        </Form.Group>
                        {(errorDescription) && (errorDescription.length != 0) && errorDescription.map((value: any, key: any) => {
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

export default FormPermission;