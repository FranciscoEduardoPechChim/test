//React
import { FormEvent, useContext, useState, useMemo, useEffect } from "react";
import { SelectChangeEvent } from '@mui/material/Select';
import { Container, Row, Col } from "react-bootstrap";
//Components
import FormPromotion from '../../../ui/forms/FormPromotion';
import ActionComponent from '../../../ui/actions/Actions';
import PathModal from '../../../ui/authmodal/PathModal';
import SortIcon from '@material-ui/icons/ArrowDownward';
import { useForm } from '../../../../hooks/useForm';
import DataTable from 'react-data-table-component';
import Loading from '../../../ui/loading/Loading';
import FilterComponent from './FilterComponent';
import Button from "../../../ui/button/Button";
import Card from '@material-ui/core/Card';
import dayjs, { Dayjs } from 'dayjs';
//Context
import { PromotionContext } from '../../../../context/promotions/PromotionContext';
//Hooks
import { usePromotions } from '../../../../hooks/usePromotions';
//Style
import styles from "./MyPromotions.module.css";
//Validations
import { isNotEmpty, isString, compareDate, isInteger, isMin } from '../../../../helpers/validations';

const MyListPromotions                                                              = () => {
    const access_token                                                              = localStorage.getItem("token");
    const { createPromotion, editPromotion, deletePromotion, undeletePromotion,
            showPromotion }                                                         = useContext(PromotionContext);
    const [ filterText, setFilterText ]                                             = useState('');
    const [ selectAction, setSelectAction ]                                         = useState('');
    const [ selectId, setSelectId ]                                                 = useState('');
    const [ actions, setActions ]                                                   = useState('create');
    const [ modalShow, setModalShow ]                                               = useState(false);
    const [ errorCode, setErrorCode ]                                               = useState([]);
    const [ errorQuantity, setErrorQuantity ]                                       = useState([]);
    const [ errorType, setErrorType ]                                               = useState([]);
    const [ errorRepeat, setErrorRepeat ]                                           = useState([]);
    const [ errorStartDate, setErrorStartDate ]                                     = useState([]);
    const [ errorEndDate, setErrorEndDate ]                                         = useState([]);
    const [ select, setSelect ]                                                     = useState<number | null>(null);
    const [ data, setData ]                                                         = useState({});
    const [ startDate, setStartDate ]                                               = useState<Dayjs | null>(null);
    const [ endDate, setEndDate ]                                                   = useState<Dayjs | null>(null);
    const { loadings, promotions, init }                                            = usePromotions((access_token) ? access_token:'');
   
    const INITIAL_STATE                                                             = {
        code:                                                                       '',
        quantity:                                                                   0,
        repeat:                                                                     0,
    }

    const { formulario, handleChange, reset }                                       = useForm(INITIAL_STATE);
    const { code, quantity, repeat }                                                = formulario;

    const columns = [
        {
            name:       'Código',
            selector:   (row:any) => row.code,
            sortable:   true
        },
        {
            name:       'Cantidad/Porcentaje',
            selector:   (row:any) => row.discount,
            sortable:   true
        },
        {
            name:       'Fecha',
            selector:   (row:any) => row.date,
            sortable:   true
        },
        {
            name:       'Disponibilidad',
            selector:   (row:any) => row.repeat,
            sortable:   true
        },
        {
            name:       'Estado',
            señectr:    (row:any) => row.deleted,
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

    const filteredItems                                                             = promotions.filter((item:any) => {
        return ((item.code && item.code.toLowerCase().includes(filterText.toLowerCase())) 
            || (item.discount && item.discount.includes(filterText.toLowerCase())) 
            || (item.repeat && String(item.repeat).includes(filterText.toLowerCase())))
    });

    const subHeaderComponentMemo                                                    = useMemo(() => {
		return (
            <FilterComponent onFilter={(e:any) => setFilterText(e.target.value)} filterText={filterText} />
		);
	}, [filterText]);

    const formValidate                                                              = (name: string, message: any) => {

        const messageError                                                          = message.filter((value:any) => value != '');
    
        if(messageError.length == 0) {
          return false;
        }
    
        switch(name) {
          case 'code':
            setErrorCode(messageError);
          return true;
          case 'quantity':
            setErrorQuantity(messageError);
          return true;
          case 'type':
            setErrorType(messageError);
          return true;
          case 'repeat':
            setErrorRepeat(messageError);
          return true;
          case 'startDate':
            setErrorStartDate(messageError);
          return true;
          case 'endDate':
            setErrorEndDate(messageError);
          return true;
          default:
          return true;
        }
    }

    const handleChangeEvent                                                         = async (event: SelectChangeEvent, id: string) => {
        if(event && id && access_token) {
         
            switch(event.target.value) {
                case 'show':
                    const response                                                  = await showPromotion(id, access_token);

                    if(response) {
                        
                        if(response.startDate && response.endDate) {
                            setStartDate(dayjs((response.startDate).toString().split('T')[0]));
                            setEndDate(dayjs((response.endDate).toString().split('T')[0]));
                        }

                        setSelect(response.type);
                        setData(response);
                        setActions(event.target.value);
                        setModalShow(true);
                    }
                break;
                case 'edit':
                    setActions(event.target.value);
                    setModalShow(true);
                break;
                case 'delete':
                    const deleteResponse                                            = await deletePromotion(id, access_token);

                    if(deleteResponse) {
                        init();
                        modalClose();
                    }
                break;
                case 'restore':
                    const restoreResponse                                           = await undeletePromotion(id, access_token);

                    console.log(id);
                    console.log(access_token);
                    console.log('dddd');
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
        setErrorCode([]); setErrorQuantity([]); setErrorType([]); setErrorRepeat([]); setErrorStartDate([]); setErrorEndDate([]);
        setStartDate(null); setEndDate(null); setSelect(null); setSelectAction('');
        reset();
        setData({});
        setModalShow(false);
    }

    const onChange                                                                  = (dates:any) => {
        const [start, end]                                                          = dates;
        setStartDate(start);
        setEndDate(end);
    };
 
    const handleSelect                                                              = (value: number) => {
        setSelect(value);
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

    const onSubmit                                                                  = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrorCode([]); setErrorQuantity([]); setErrorType([]); setErrorRepeat([]); setErrorStartDate([]); setErrorEndDate([]);

        const formCode                                                              = formValidate('code', [isNotEmpty(code), isString(code)]);
        const formQuantity                                                          = formValidate('quantity', [isNotEmpty(quantity), isInteger(quantity), isMin(quantity, 1)]);
        const formStartDate                                                         = formValidate('startDate', [compareDate(startDate, endDate, true)]);
        const formEndDate                                                           = formValidate('endDate', [compareDate(startDate, endDate, true)]);
        const formType                                                              = formValidate('type', [isNotEmpty((Number.isInteger(select)) ? String(select):0), isInteger(select)]);
        const formRepeat                                                            = formValidate('repeat', [isNotEmpty(repeat), isInteger(repeat), isMin(repeat, 1)]);

        if(formCode || formQuantity || formType || formRepeat || formStartDate || formEndDate) {
            return false;
        }

        if(access_token && (select != null)) {

            const isValid                                                           = await createPromotion(code,(startDate) ? new Date(startDate.format('YYYY-MM-DD')): null ,(endDate) ? new Date(endDate.format('YYYY-MM-DD')): null, quantity, select, repeat, access_token);

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
                                data                        = {filteredItems}
                                sortIcon                    = {<SortIcon />}
                                noDataComponent             = {<span className='my-4'>Al parecer aún no tienes ninguna promoción</span>}
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
                title               = {'Promociones'}
                routeName           = {'promotions'}
                modalShow           = {modalShow}
                onSubmit            = {onSubmit}
            >
                <FormPromotion 
                    action          = {actions}
                    typeArray       = {[{id: 0 , name: '$'},{id: 1, name:'%'}]}
                    data            = {data}
                    select          = {select}
                    errorCode       = {errorCode}
                    errorQuantity   = {errorQuantity}
                    errorType       = {errorType}
                    errorRepeat     = {errorRepeat}
                    errorStartDate  = {errorStartDate}
                    errorEndDate    = {errorEndDate}
                    startDate       = {startDate}
                    endDate         = {endDate}
                    onChange        = {onChange}
                    modalClose      = {modalClose}
                    handleChange    = {handleChange}
                    handleDate      = {handleDate}
                    handleSelect    = {handleSelect}
                />
            </PathModal>
        </>
    );
};

export default MyListPromotions;
