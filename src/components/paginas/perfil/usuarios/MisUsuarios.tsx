import { FormEvent, useContext, useState, useMemo } from "react";
import { Container, Form, Col, Row, Card, Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { AuthContext } from "../../../../context/auth/AuthContext";
import { useForm } from "../../../../hooks/useForm";
import { useMisUsuarios, useMyUsersById } from "../../../../hooks/useUserInfo";
import { UsuariosPagado } from "../../../../interfaces/MisUsuariosInterface";
import Buttons from "../../../ui/button/Button";
import Loading from "../../../ui/loading/Loading";
import styles from "./MisUsuarios.module.css";

//React
import { SelectChangeEvent } from '@mui/material/Select';
import DataTable from 'react-data-table-component';
import { ToastContainer } from "react-toastify";
//Validations
import { isNotEmpty, isString, isLength, isEmail, isSamePassword } from '../../../../helpers/validations';
//Middlewares
import { isUser, isUserByPay, isAdmin, isSuperAdmin } from '../../../../middlewares/roles';
//Components
import FilterComponent from '../../../ui/filters/FilterComponent';
import Modaltitle from "../../../ui/modaltitle/Modaltitle";
import ActionComponent from '../../../ui/actions/Actions';
import SortIcon from '@material-ui/icons/ArrowDownward';
//Services
import { showUser } from '../../../../services/userService';
//Extras
import Swal from "sweetalert2";

const MisUsuarios                                                   = () => {
  const access_token                                                = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
  const { auth, createUser, editUser, deleteUser }                  = useContext(AuthContext);
  const { users, loading, init, setLoading }                        = useMyUsersById((auth.uid) ? auth.uid:'', (access_token) ? access_token:'');
  const [ showPassword, setShowPassword ]                           = useState(false);
  const [ showConfirmPassword, setShowConfirmPassword ]             = useState(false);
  const [ errorName, setErrorName ]                                 = useState([]);
  const [ errorLastName, setErrorLastName ]                         = useState([]);
  const [ errorEmail, setErrorEmail ]                               = useState([]);
  const [ errorPassword, setErrorPassword ]                         = useState([]);
  const [ errorConfirmPassword, setErrorConfirmPassword]            = useState([]);
  const [ showForm, setShowForm ]                                   = useState(false);
  const [ selectAction, setSelectAction ]                           = useState('');
  const [ selectId, setSelectId ]                                   = useState('');
  const [ actions, setActions ]                                     = useState('create');
  const [ filterText, setFilterText ]                               = useState('');
  const [ resetPassword, setResetPassword ]                         = useState(false);
  const [ showModal, setShowModal ]                                 = useState(false);
  const [ changeUser, setChangeUser ]                               = useState('');
  const [ userArray, setUserArray ]                                 = useState<any>([]);
  const [ errorUser , setErrorUser ]                                = useState([]);

  const INITIAL_STATE                                               = {
    name:                                                           '',
    lastName:                                                       '',
    email:                                                          '',
    password:                                                       '',
    confirmPassword:                                                '',
    role:                                                           'UsuarioPagado'
  }

  const { formulario, handleChange, reset, setFormulario }          = useForm(INITIAL_STATE);
  const { name, lastName, email, password, confirmPassword }        = formulario;

  const columns = [
    {
        name:       'Nombre completo',
        selector:   (row:any) => (row.nombre + ' ' + row.apellido),
        sortable:   true
    },
    {
        name:       'Correo electrónico',
        selector:   (row:any) => row.correo,
        sortable:   true
    },
    {
        name:       'role',
        selector:   (row:any) => row.role,
        sortable:   true
    },
    {
        name:       'Acciones',
        selector:   (row:any) => row.actions,
        cell:       (row:any) => <ActionComponent actions={['show', 'edit', 'delete']} selectAction={selectAction} selectId={selectId} id={row.uid} handleChange={(event: SelectChangeEvent, id: string) => handleChangeEvent(event, id)} />,
    },
  ]

  const paginationComponentOptions                                  = {
    rowsPerPageText: 'Cantidad',
    rangeSeparatorText: '-',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
  }

  const filteredItems                                               = users.filter((item:any) => {
    return ((item.nombre && item.nombre.toLowerCase().includes(filterText.toLowerCase())) 
        || (item.apellido && item.apellido.includes(filterText.toLowerCase())) 
        || (item.correo && item.correo.includes(filterText.toLowerCase())))
  })

  const subHeaderComponentMemo                                      = useMemo(() => {
		return (
            <FilterComponent onFilter={(e:any) => setFilterText(e.target.value)} filterText={filterText} />
		);
	}, [filterText]);

  const formValidate                                                = (name: string, message: any) => {

    const messageError                                              = message.filter((value:any) => value != '');

    if(messageError.length == 0) {
      return false;
    }

    switch(name) {
      case 'name':
        setErrorName(messageError);
      return true;
      case 'lastName':
        setErrorLastName(messageError);
      return true;
      case 'email':
        setErrorEmail(messageError);
      return true;
      case 'password':
        setErrorPassword(messageError);
      return true;
      case 'confirmPassword':
        setErrorConfirmPassword(messageError);
      return true;
      case 'user':
        setErrorUser(messageError);
      return true;
      default:
      return true;
    }
  }

  const getUser                                                     = async (id: string, access_token: string, value: any) => {
    const response                                                  = await showUser(id, access_token);

    if(response && response.data) {     

      const { data }:any                                            = response;

      setFormulario({
        name:                                                       data.users.nombre,
        lastName:                                                   data.users.apellido,
        email:                                                      data.users.correo,
        password:                                                   '',
        confirmPassword:                                            '',
        role:                                                       'UsuarioPagado'
      });

      setActions(value);
      setShowForm(true);
    }
  }

  const modalClose                                                  = async () => {
    setShowModal(false);
    cardClose();
  }

  const handleChangeEvent                                           = async (event: SelectChangeEvent, id: string) => {
    if(event && id && access_token) {
     
        switch(event.target.value) {
            case 'show':
                getUser(id, access_token, event.target.value);
            break;
            case 'edit':
                getUser(id, access_token, event.target.value);
            break;
            case 'delete':
              const userChange                                      = users.filter((value:any) => {
                if(value.uid != id) {
                  return value;
                }
              });

              setUserArray(userChange);

              Swal.fire({
                title: '¿Está de acuerdo en eliminar al usuario?',
                text: "Antes de eliminar a un usuario es necesario realizar los cambios de los inmuebles, historial u otras opciones, esto hacia otro usuario existente",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'De acuerdo'
              }).then(async (result) => {
                if (result.isConfirmed) {
                  setShowModal(true);
                }else if(result.isDismissed) {
                  cardClose();
                }
              })
            break;
        }

        setSelectId(id);
        setSelectAction(event.target.value);
    }
  }

  const handleCreate                                                = async () => {
    setActions('create');
    setShowForm(true);
  }

  const cardClose                                                   = () => {
    setErrorName([]); setErrorLastName([]); setErrorEmail([]); setErrorPassword([]); setErrorConfirmPassword([]); setErrorUser([]);
    setSelectAction('');
    setChangeUser('');
    reset();
    setShowForm(false);
  }

  const handleSubmit                                                = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorName([]); setErrorLastName([]); setErrorEmail([]); setErrorPassword([]); setErrorConfirmPassword([]); setErrorUser([]);

    const formName                                                  = formValidate('name', [isNotEmpty(name), isString(name)]);
    const formLastName                                              = formValidate('lastName', [isNotEmpty(lastName), isString(lastName)]);
    const formEmail                                                 = formValidate('email', [isNotEmpty(email), isEmail(email)]);
    let formPassword                                                = false;
    let formConfirmPassword                                         = false;

    if(((actions == 'edit') && (password != '' || confirmPassword != '')) || (actions == 'create')) {
      formPassword                                                  = formValidate('password', [isNotEmpty(password), isLength(4,20, password), isString(password), isSamePassword(password, confirmPassword)]);
      formConfirmPassword                                           = formValidate('confirmPassword', [isNotEmpty(confirmPassword), isLength(4,20, confirmPassword) ,isString(confirmPassword), isSamePassword(confirmPassword, password)]);  
    }

    if(formName || formLastName || formEmail || formPassword || formConfirmPassword) {
      return false;
    }

    const isValid                                                   = (actions == 'create') ? 
    await createUser(name, lastName, email, password, confirmPassword, (auth.uid) ? auth.uid:'', (access_token) ? access_token:''):
    await editUser(selectId, name, lastName, email, password, confirmPassword, (access_token) ? access_token:'');

    if (isValid) {
      init();
      cardClose();
    }
  }

  const handleUser                                                  = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorUser([]);

    const formUser                                                  = formValidate('user', [isNotEmpty(changeUser)]);

    if(formUser) {
      return false;
    }

    setLoading(true);
    
    const isValid                                                   = await deleteUser(selectId, changeUser, (access_token) ? access_token:"");

    if(isValid) {
      setLoading(false);
      init();
      cardClose();
    }

  }

  const showPasswordInput                                           = () => setShowPassword(!showPassword);

  const showConfirmPasswordInput                                    = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <>                                                        
      <Container>
        <Row>
          <Card className="mb-5 mt-4">
              <Row>
                  <Col className="mt-3 mx-2" xs={6}>
                      <Buttons
                          titulo  = "Añadir"
                          btn     = "Green"
                          onClick = {handleCreate}
                      />
                  </Col>
              </Row>
              {(((!(isUser() || isUserByPay())) && (auth.usuarios && (auth.usuarios > users.length))) || (isAdmin() || isSuperAdmin())) && showForm &&
                <Row className='my-3 mx-2 d-flex justify-content-center'>
                  <Col md sm xs={12}>
                    <Card>
                        <Form onSubmit={handleSubmit} className="my-2">
                          <Container>
                            <Row>
                              <Col md={6} sm xs={12} className="my-2">
                                <Form.Group >
                                  <Form.Label>Nombre(s)*</Form.Label>
                                    {actions && (actions != 'show') &&
                                      <Form.Control
                                        autoComplete    = "off"
                                        value           = {name}
                                        onChange        = {handleChange}
                                        name            = "name"
                                        type            = "text"
                                        maxLength       = {255}
                                        placeholder     = "John"
                                      />
                                    }
                                    {actions && (actions == 'show') &&
                                      <Form.Control
                                        autoComplete    = "off"
                                        value           = {name}
                                        onChange        = {handleChange}
                                        name            = "name"
                                        type            = "text"
                                        maxLength       = {255}
                                        placeholder     = "John"
                                        disabled
                                      />
                                    }
                                    {(errorName) && (errorName.length != 0) && 
                                      errorName.map((value:any, key: any) => { return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>); })           
                                    }
                                </Form.Group>
                              </Col>
                              <Col md={6} sm xs={12} className="my-2">
                                <Form.Group >
                                  <Form.Label>Apellido(s)*</Form.Label>
                                    {actions && (actions != 'show') &&
                                      <Form.Control
                                          autoComplete    = "off"
                                          value           = {lastName}
                                          onChange        = {handleChange}
                                          name            = "lastName"
                                          type            = "text"
                                          maxLength       = {255}
                                          placeholder     = "Miller"
                                        />
                                    }
                                    {actions && (actions == 'show') &&
                                      <Form.Control
                                         autoComplete    = "off"
                                         value           = {lastName}
                                         onChange        = {handleChange}
                                         name            = "lastName"
                                         type            = "text"
                                         maxLength       = {255}
                                         placeholder     = "Miller"
                                         disabled
                                       />
                                    }
                                    {(errorLastName) && (errorLastName.length != 0) && 
                                      errorLastName.map((value:any, key: any) => { return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>); })           
                                    }
                                </Form.Group>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={6} sm xs={12} className="my-2">
                                <Form.Group >
                                  <Form.Label>Correo electrónico*</Form.Label>
                                    {actions && (actions != 'show') &&
                                      <Form.Control
                                        autoComplete    = "off"
                                        value           = {email}
                                        onChange        = {handleChange}
                                        name            = "email"
                                        type            = "email"
                                        maxLength       = {255}
                                        placeholder     = "user@example.com"
                                      />
                                    }
                                   {actions && (actions == 'show') &&
                                      <Form.Control
                                        autoComplete    = "off"
                                        value           = {email}
                                        onChange        = {handleChange}
                                        name            = "email"
                                        type            = "email"
                                        maxLength       = {255}
                                        placeholder     = "user@example.com"
                                        disabled
                                      />
                                    }
                                    {(errorEmail) && (errorEmail.length != 0) && 
                                      errorEmail.map((value:any, key: any) => { return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>); })           
                                    }
                                </Form.Group>
                              </Col>
                              {actions && (actions == 'create') &&
                                <>
                                  <Col md={6} sm xs={12} className="my-2">
                                    <Form.Group >
                                      <Form.Label>Contraseña*</Form.Label>
                                        <div className={styles.relative}>
                                            <Form.Control
                                              autoComplete    = "off"
                                              value           = {password}
                                              onChange        = {handleChange}
                                              name            = "password"
                                              type            = {(showPassword) ? "text":"password"}
                                              maxLength       = {255}
                                            />
                                            <i
                                              onClick         = {showPasswordInput}
                                              className       = {`${ showPassword ? "bi bi-eye-slash" : "bi bi-eye"} ${styles.mostrarContraseña}`}
                                            />
                                        </div>
                                        {(errorPassword) && (errorPassword.length != 0) && 
                                          errorPassword.map((value:any, key: any) => { return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>); })           
                                        }
                                    </Form.Group>
                                  </Col>
                                  <Col md={6} sm xs={12} className="my-2">
                                    <Form.Group >
                                      <Form.Label>Confirmar contraseña*</Form.Label>
                                          <div className={styles.relative}>
                                            <Form.Control
                                              autoComplete    = "off"
                                              value           = {confirmPassword}
                                              onChange        = {handleChange}
                                              name            = "confirmPassword"
                                              type            = {(showConfirmPassword) ? "text":"password"}
                                              maxLength       = {255}
                                            />
                                            <i
                                              onClick         = {showConfirmPasswordInput}
                                              className       = {`${ showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"} ${styles.mostrarContraseña}`}
                                            />
                                          </div>
                                        {(errorConfirmPassword) && (errorConfirmPassword.length != 0) && 
                                          errorConfirmPassword.map((value:any, key: any) => { return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>); })           
                                        }
                                    </Form.Group>
                                  </Col>
                                </>
                              }
                              {actions && (actions == 'edit') &&
                                <Col md={6} sm xs={12} className={styles.resetpassword}>
                                  <Button type="button" variant="outline-warning" style={{width: '100%'}} onClick={() => (resetPassword) ? setResetPassword(false):setResetPassword(true)}>Restaurar contraseña</Button>
                                </Col>
                              }
                            </Row>
                            {actions && (actions == 'create') || (resetPassword) &&
                              <Row>
                                {resetPassword &&
                                  <Col md={6} sm xs={12} className="my-2">
                                    <Form.Group >
                                      <Form.Label>Contraseña*</Form.Label>
                                        <div className={styles.relative}>
                                            <Form.Control
                                              autoComplete    = "off"
                                              value           = {password}
                                              onChange        = {handleChange}
                                              name            = "password"
                                              type            = {(showPassword) ? "text":"password"}
                                              maxLength       = {255}
                                            />
                                            <i
                                              onClick         = {showPasswordInput}
                                              className       = {`${ showPassword ? "bi bi-eye-slash" : "bi bi-eye"} ${styles.mostrarContraseña}`}
                                            />
                                        </div>
                                        {(errorPassword) && (errorPassword.length != 0) && 
                                          errorPassword.map((value:any, key: any) => { return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>); })           
                                        }
                                    </Form.Group>
                                  </Col>
                                }
                                <Col md={6} sm xs={12} className="my-2">
                                  <Form.Group >
                                    <Form.Label>Confirmar contraseña*</Form.Label>
                                        <div className={styles.relative}>
                                          <Form.Control
                                            autoComplete    = "off"
                                            value           = {confirmPassword}
                                            onChange        = {handleChange}
                                            name            = "confirmPassword"
                                            type            = {(showConfirmPassword) ? "text":"password"}
                                            maxLength       = {255}
                                          />
                                          <i
                                            onClick         = {showConfirmPasswordInput}
                                            className       = {`${ showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"} ${styles.mostrarContraseña}`}
                                          />
                                        </div>
                                      {(errorConfirmPassword) && (errorConfirmPassword.length != 0) && 
                                        errorConfirmPassword.map((value:any, key: any) => { return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>); })           
                                      }
                                  </Form.Group>
                                </Col>
                              </Row>
                            }
                            <Row>
                              <Col md sm xs={12} className="d-flex justify-content-end my-3">
                                {actions && (actions != 'show') &&
                                  <Button type="submit" variant="success">Guardar</Button>
                                }
                                {actions && (actions != 'show') &&
                                  <Button className='mx-1' type="reset" variant="danger" onClick={() => cardClose()}>Cancelar</Button>
                                }
                                {actions && (actions == 'show') &&
                                  <Button className='mx-1' type="reset" variant="outline-secondary" onClick={() => cardClose()}>Cerrar</Button>
                                }
                              </Col>
                            </Row>
                          </Container>
                        </Form>
                    </Card>
                  </Col>
                </Row>
              }
              <Row className="justify-content-center">
                <DataTable
                  columns                     = {columns}
                  data                        = {filteredItems}
                  sortIcon                    = {<SortIcon />}
                  noDataComponent             = {<span className='my-4'>Al parecer aún no tienes ningún usuario</span>}
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

      <Modal
            size                        = {'lg'}
            backdrop                    = {'static'}
            keyboard                    = {false}
            show                        = {showModal}
            contentClassName            = {styles.modalContent}
        >
            <Modal.Header style={{ border: "none"}} />
            <ToastContainer autoClose = {10000} />

            <Modal.Body>
                <Form 
                    onSubmit            = {handleUser}
                >
                  <div className="row d-flex justify-content-center">
                    <Modaltitle titulo  = {'Asignación de usuario'} />
                    <Container>
                      <Row >
                        <Col md sm xs={12} className='my-2'>
                          <Form.Group>
                              <Form.Label className={styles.modalLabels} htmlFor="userId">Usuario*</Form.Label>
                              <Form.Select 
                                    id              = "userId"  
                                    value           = {changeUser}
                                    onChange        = {e => {
                                      setChangeUser(e.target.value);
                                    }}
                                >
                                    <option value={''} disabled>Seleccionar Usuario</option>
                                    
                                    {(userArray) && (userArray.length != 0) && userArray.map((value:any, key:any) => {
                                        return (<option key={key} value={value.uid}>{value.nombre} {value.apellido} ({value.correo})</option>);        
                                    })}
                                </Form.Select>
                          </Form.Group>
                          {(errorUser) && (errorUser.length != 0) && errorUser.map((value: any, key: any) => {
                            return (<div key={key}><span className={'text-danger mb-1'}>{value}</span></div>);
                          })}
                        </Col>
                      </Row>
                      <Row className='my-3'>
                        <Col className='d-flex justify-content-end' md sm xs={12}>
                          <Button type="submit" variant="success">Guardar</Button>
                          <Button className='mx-1' type="reset" variant="danger" onClick={() => modalClose()}>Cancelar</Button>
                        </Col>
                    </Row>
                    </Container>
                  </div>
                </Form>
            </Modal.Body>
      </Modal>
    </>
  );
};

export default MisUsuarios;
