//React
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import es from 'date-fns/locale/es';
import { ChangeEvent } from 'react';
//Stylist 
import 'react-datepicker/dist/react-datepicker.css';
import style from './FormPromotion.module.css';
//Extras
registerLocale('es', es)



interface Props {
    action:         string;
    typeArray:      any;
    data:           any;
    startDate:      Date | null;
    endDate:        Date | null;
    errorCode:      any;
    errorQuantity:  any;
    errorType:      any;
    errorRepeat:    any;
    onChange:       (dates: any) => void;
    modalClose:     () => void;
    handleChange:   ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const FormPromotion = ({action, handleChange, data, startDate, endDate, onChange, typeArray, errorCode, modalClose, errorQuantity, errorType, errorRepeat}:Props) => {
    return (
        <Container>
            <Row className='my-2'>
                <Col md={6} sm xs={12} >
                    <Form.Group>
                        <Form.Label className={style.modalLabels} htmlFor="code">Código</Form.Label>
                        <Form.Control id="code" type="text" name="code" placeholder="PROMOTIONMX" onChange={handleChange}/>
                    </Form.Group>
                    {(errorCode) && (errorCode.length != 0) && errorCode.map((value: any, key: any) => {
                        return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                    })}
                </Col>
                <Col md={4} sm xs={12} >
                    <Form.Group>
                        <Form.Label className={style.modalLabels} htmlFor="quantity">Cantidad</Form.Label>
                        <Form.Control min={0} id="quantity" type="number" name="quantity" placeholder="0" onChange={handleChange}/>   
                    </Form.Group>
                    {(errorQuantity) && (errorQuantity.length != 0) && errorQuantity.map((value: any, key: any) => {
                        return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                    })}
                   
                </Col>
                <Col md={2} sm xs={12}>
                    <Form.Group>
                        <Form.Label className={style.modalLabels} htmlFor="type">Tipo</Form.Label>
                        <Form.Select id="type">
                            {(typeArray) && (typeArray.length != 0) && typeArray.map((value:any, key:any) => {
                                return (<option key={key} value={value.id}>{value.name}</option>);
                            })}
                        </Form.Select>
                    </Form.Group>   
                    {(errorType) && (errorType.length != 0) && errorType.map((value: any, key: any) => {
                        return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                    })}
                </Col>
            </Row>
            <Row className='my-3'>
                <Col md={6} sm xs={12} >
                    <Form.Group>
                        <Form.Label className={style.modalLabels} htmlFor="date">Fechas</Form.Label>

                        <DatePicker
                            id          = 'date'
                            className   = 'form-control'
                            dateFormat  = 'dd/MM/yyyy'
                            selected    = {startDate}
                            onChange    = {onChange}
                            startDate   = {startDate}
                            endDate     = {endDate}
                            locale      = 'es'
                            selectsRange
                        />
                    </Form.Group>
                </Col>
                <Col md={6} sm xs={12} >
                    <Form.Group>
                        <Form.Label className={style.modalLabels} htmlFor="repeat">Disponibilidad</Form.Label>
                        <Form.Control min={0} id="repeat" type="number" name="repeat" placeholder="0" onChange={handleChange}/>
                    </Form.Group>
                    {(errorRepeat) && (errorRepeat.length != 0) && errorRepeat.map((value: any, key: any) => {
                        return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                    })}
                </Col>
            </Row>
            <Row className='mt-5 mb-4'>
                <Col className='d-flex justify-content-end' md sm xs={12}>
                    <Button type="submit" variant="success">Guardar</Button>
                    <Button className='mx-1' type="reset" variant="danger" onClick={() => modalClose()}>Cancelar</Button>
                </Col>
            </Row>
        </Container>
    );
}   

export default FormPromotion;