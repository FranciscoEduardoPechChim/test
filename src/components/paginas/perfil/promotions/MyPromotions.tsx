//React
import { FormEvent, useContext, useState, useMemo } from "react";
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
import { Dayjs } from 'dayjs';
//Context
import { PromotionContext } from '../../../../context/promotions/PromotionContext';
//Hooks
import { usePromotions } from '../../../../hooks/usePromotions';
//Style
import styles from "./MyPromotions.module.css";

const MyListPromotions                                                              = () => {
    const { createPromotion, editPromotion, deletePromotion, undeletePromotion }    = useContext(PromotionContext);
    const [ offset, setOffset ]                                                     = useState(0);
    const [ limit, setLimit ]                                                       = useState(10);
    const [ filterText, setFilterText ]                                             = useState('');
    const [ selectAction, setSelectAction ]                                         = useState('');
    const [ selectId, setSelectId ]                                                 = useState('');
    const [ actions, setActions ]                                                   = useState('create');
    const [ modalShow, setModalShow ]                                               = useState(false);
    const [ errorCode, setErrorCode ]                                               = useState([]);
    const [ errorQuantity, setErrorQuantity ]                                       = useState([]);
    const [ errorType, setErrorType ]                                               = useState([]);
    const [ errorRepeat, setErrorRepeat ]                                           = useState([]);
    const [ select, setSelect ]                                                     = useState<number | null>(null);
    const [ data, setData ]                                                         = useState({});
    const [ startDate, setStartDate ]                                               = useState<Dayjs | null>(null);
    const [ endDate, setEndDate ]                                                   = useState<Dayjs | null>(null);
    const { loading, promotions, total }                                            = usePromotions(offset, limit);


    const INITIAL_STATE                                                             = {
        code:                                                                       '',
        quantity:                                                                   0,
        type:                                                                       0,
        repeat:                                                                     0,
        date:                                                                       null
    }

    const { formulario, handleChange }                                              = useForm(INITIAL_STATE);
    const { code, quantity, type, repeat, date }                                    = formulario;

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

    // Otras acciones
    const handleChangeEvent                                                         = async (event: SelectChangeEvent, id: string) => {
        if(event && id) {
            switch(event.target.value) {
                case 'show':
                    setActions(event.target.value);
                break;
                case 'edit':
                    setActions(event.target.value);
                break;
                case 'delete':
                break;
                case 'restore':
                break;
            }

            setSelectId(id);
            setSelectAction(event.target.value);
        }
    }

    // Crear esclusivamente
    const handleCreate                                                              = async () => {
        console.log('ffgfghffgh');

        setActions('create');
        setModalShow(true);
    }

    const modalClose                                                                = () => {
        setErrorCode([]);
        setErrorQuantity([]);
        setErrorType([]);
        setErrorRepeat([]);
        setStartDate(null);
        setEndDate(null);
        setSelect(null);
        setSelectAction('');
        setModalShow(false);
    }

    const onChange                                                                  = (dates:any) => {
        const [start, end]                                                          = dates;
        setStartDate(start);
        setEndDate(end);
    };

    // Solo select
    const handleSelect                                                              = (value: number) => {
        setSelect(value);
    }

    // Fecha esclusivamente
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

        console.log('Hello world');
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
                                progressPending             = {loading} 
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
