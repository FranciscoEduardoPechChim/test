//React
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import { ChangeEvent, ChangeEventHandler } from 'react';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
//Stylist 
import style from './FormPromotion.module.css';

interface Props {
    action:         string;
    typeArray:      any;
    data:           any;
    select:         number | null;
    startDate:      Dayjs | null;
    endDate:        Dayjs | null;
    errorCode:      any;
    errorQuantity:  any;
    errorType:      any;
    errorRepeat:    any;
    errorStartDate: any;
    errorEndDate:   any;
    onChange:       (dates: any) => void;
    modalClose:     () => void;
    handleSelect:   (input: number) => void;
    handleDate:     (type: string, date: Dayjs | null) => void;
    handleChange:   ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}
const locales       = ['es'] as const;

const FormPromotion = ({action, handleChange, data, handleSelect, select, startDate, handleDate, endDate, onChange, typeArray, errorStartDate, errorEndDate, errorCode, modalClose, errorQuantity, errorType, errorRepeat}:Props) => {
    
    const code      = (action != 'create') ? data.code:'';
    const quantity  = (action != 'create') ? data.quantity:0;
    const repeat    = (action != 'create') ? data.repeat:0;
  
    return (
        <Container>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'es'}>
                <Row >
                    <Col md={6} sm xs={12} className='my-2'>
                        <Form.Group>
                            <Form.Label className={style.modalLabels} htmlFor="code">Código*</Form.Label>
                            <Form.Control defaultValue={code} id="code" type="text" name="code" placeholder="PROMOTIONMX" onChange={handleChange}/>
                        </Form.Group>
                        {(errorCode) && (errorCode.length != 0) && errorCode.map((value: any, key: any) => {
                            return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                        })}
                    </Col>
                    <Col md={6} sm xs={12} className='my-2'>
                        <Form.Group>
                            <Form.Label className={style.modalLabels} htmlFor="quantity">Cantidad*</Form.Label>
                            <Form.Control defaultValue={quantity} id="quantity" type="number" min={0} name="quantity" placeholder="0" onChange={handleChange}/>   
                        </Form.Group>
                        {(errorQuantity) && (errorQuantity.length != 0) && errorQuantity.map((value: any, key: any) => {
                            return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                        })}
                    
                    </Col>
                </Row>
                <Row >
                    <Col md={6} sm xs={12} className='my-2'>
                        <Form.Group>
                            {/* <Form.Label className={style.modalLabels} htmlFor="startDate">Fecha inicial</Form.Label>  */}
                            <DatePicker
                                label       = 'Fecha inicial'
                                value       = {startDate}
                                inputFormat = 'DD-MM-YYYY'
                                onChange    = {(newDate:any) => {
                                    handleDate('startDate', newDate);
                                }}
                                minDate     = {new Date()}
                                renderInput = {(params) => <TextField size="small" {...params} fullWidth/>}
                            />
                            {(errorStartDate) && (errorStartDate.length != 0) && errorStartDate.map((value: any, key: any) => {
                                return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                            })}
                        </Form.Group>
                    </Col>
                    <Col md={6} sm xs={12} className='my-2'>
                        <Form.Group>
                            {/* <Form.Label className={style.modalLabels} htmlFor="endDate">Fecha final</Form.Label> */}
                            <DatePicker
                                label       = 'Fecha final'
                                value       = {endDate}
                                inputFormat = 'DD-MM-YYYY'
                                onChange    = {(newDate:any) => {
                                    handleDate('endDate', newDate);
                                }}
                                minDate     = {new Date()}
                                renderInput = {(params) => <TextField size="small" {...params} fullWidth/>}
                            />
                            {(errorEndDate) && (errorEndDate.length != 0) && errorEndDate.map((value: any, key: any) => {
                                return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                            })}
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6} sm xs={12} className='my-2'>
                        <Form.Group>
                            <Form.Label className={style.modalLabels} htmlFor="type">Tipo*</Form.Label>
                            <Form.Select 
                                id              = "type"  
                                value           = {(select == null) ? '':select}
                                onChange        = {e => {
                                    handleSelect(parseInt(e.target.value));
                                }}
                            >
                                {action && (action != 'show') &&
                                    <option value={''} disabled>Seleccionar tipo</option>
                                }
                                {(typeArray) && (typeArray.length != 0) && typeArray.map((value:any, key:any) => {
                                    return (<option key={key} value={value.id}>{value.name}</option>);
                                    
                                })}
                            </Form.Select>
                        </Form.Group>   
                        {(errorType) && (errorType.length != 0) && errorType.map((value: any, key: any) => {
                            return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                        })}
                    </Col>
                    <Col md={6} sm xs={12} className='my-2'>
                        <Form.Group>
                            <Form.Label className={style.modalLabels} htmlFor="repeat">Disponibilidad*</Form.Label>
                            <Form.Control defaultValue={repeat} id="repeat" type="number" name="repeat" min={0} placeholder="0" onChange={handleChange}/>
                        </Form.Group>
                        {(errorRepeat) && (errorRepeat.length != 0) && errorRepeat.map((value: any, key: any) => {
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
            </LocalizationProvider>
        </Container>
    );
}   

export default FormPromotion;