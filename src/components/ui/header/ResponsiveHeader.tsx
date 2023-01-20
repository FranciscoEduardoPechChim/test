import { useContext, useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import { AuthContext } from "context/auth/AuthContext";
import LoginModal from "../authmodal/LoginModal";

//Middlewares
import { hasPermission } from '../../../middlewares/roles';
//Material UI
import { Box, InputLabel, MenuItem, FormControl, Select, SelectChangeEvent } from '@mui/material';
//Context
import { MapContext } from "context/map/MapContext";       

const ResponsiveHeader                      = () => {
  const { auth, abrirLogin, abrirRegistro } = useContext(AuthContext);
  const [mostrar, setMostrar]               = useState(true);
  const { setUbicacionUsuario, 
    setCoordenadas, property, setProperty } = useContext(MapContext);
  const [ location, setLocation ]           = useState(0);

  const cerrarMenu                          = () => setMostrar(true);

  const openLogin                           = () => {
    cerrarMenu();
    abrirLogin();
  }

  const openRegister                        = () => {
    cerrarMenu();
    abrirRegistro();
  }

  const handleChangeSelect                  = (event: SelectChangeEvent) => {

    if(Number(event.target.value) == 0) {
      setUbicacionUsuario({ lat: 19.4326078, lng: -99.133207 }); 
      setCoordenadas({ lat: 19.4326078, lng: -99.133207 }); 
    }else {
      setUbicacionUsuario({ lat: 25.7825453, lng: -80.2994984 }); 
      setCoordenadas({ lat: 25.7825453, lng: -80.2994984 }); 
    }

    setLocation(Number(event.target.value));
  }

  const handleChangePropertiesSelect        = (event: SelectChangeEvent) => {
    setProperty(Number(event.target.value));
  }

  return (
    <div className={styles.respNavbar}>
      <div className={styles.containerBi}>
        <i
          onClick={() => setMostrar(!mostrar)}
          className={`${styles.listIcon}  ${
            mostrar ? "bi bi-list" : "bi bi-x-lg"
          }`}
        />
      </div>
      <div
        className={`container my-2 d-flex ${
          mostrar ? "justify-content-center" : "justify-content-end"
        }`}
      >
        <Link href="/">
          <img
            src="/images/logos/red1-color.png"
            alt="Red 1 a 1"
            className="pointer"
            onClick={cerrarMenu}
          />
        </Link>
      </div>

      <div className={`${mostrar ? styles.resHeader : styles.resHeaderAtive}`}>
        {!auth.logged ? (
          <div>
            <br />
            <br />
            <div className={styles.headerLinkItem} onClick={openRegister}>
              Regístrate
            </div>
            <div className={styles.headerLinkItem} onClick={openLogin}>
              Inicia sesión
            </div>
            {/* <div className="mx-3">
              <Select
                    sx        = {{ '.MuiOutlinedInput-notchedOutline': { border: 'none' } }}
                    labelId   = "demo-simple-select-label"
                    id        = "demo-simple-select"
                    value     = {String(location)}
                    label     = "location"
                    onChange  = {handleChangeSelect}
                  >
                    <MenuItem value={0}><img width={30} height={25} src={'https://res.cloudinary.com/dhcyyvrus/image/upload/v1671232286/images/icons8-mexico-48_1_gi2dq6.png'} /></MenuItem>
                    <MenuItem value={1}><img width={30} height={25} src={'https://res.cloudinary.com/dhcyyvrus/image/upload/v1671232286/images/icons8-united-states-48_pxsiqh.png'} /></MenuItem>
              </Select>
            </div>
            <div className="mx-3">
              <Select
                sx        = {{'.MuiOutlinedInput-notchedOutline': { border: 'none' }, color: 'white', fontSize: '1.5rem', marginTop: '-0.5rem'}}
                labelId   = "simple-select-label"
                id        = "simple-select"
                value     = {String(property)}
                label     = "property"
                onChange  = {handleChangePropertiesSelect}
              >
                <MenuItem value={0}>Inmuebles</MenuItem>
                <MenuItem value={1}>Inmobilarias</MenuItem>
              </Select>
            </div> */}
            <div className="mx-3">
              <Select
                    sx        = {{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                    labelId   = "demo-simple-select-label"
                    id        = "demo-simple-select"
                    value     = {String(location)}
                    label     = "location"
                    onChange  = {handleChangeSelect}
                  >
                    <MenuItem value={0}><img width={30} height={25} src={'https://res.cloudinary.com/dhcyyvrus/image/upload/v1671232286/images/icons8-mexico-48_1_gi2dq6.png'} /></MenuItem>
                    <MenuItem value={1}><img width={30} height={25} src={'https://res.cloudinary.com/dhcyyvrus/image/upload/v1671232286/images/icons8-united-states-48_pxsiqh.png'} /></MenuItem>
              </Select> 
              {/* <DropdownButton 
                  className = {`mt-2`}
                  title     = {<img width={30} height={25} src={(String(location) == '0') ? 'https://res.cloudinary.com/dhcyyvrus/image/upload/v1671232286/images/icons8-mexico-48_1_gi2dq6.png':'https://res.cloudinary.com/dhcyyvrus/image/upload/v1671232286/images/icons8-united-states-48_pxsiqh.png'} />}
                  onSelect  = {(e:any) => handleChangeSelect(String(e))}
              >
                <Dropdown.Item eventKey="0" active={(String(location) == '0') ? true:false}><img width={30} height={25} src={'https://res.cloudinary.com/dhcyyvrus/image/upload/v1671232286/images/icons8-mexico-48_1_gi2dq6.png'} /></Dropdown.Item>
                <Dropdown.Item eventKey="1" active={(String(location) == '1') ? true:false}><img width={30} height={25} src={'https://res.cloudinary.com/dhcyyvrus/image/upload/v1671232286/images/icons8-united-states-48_pxsiqh.png'} /></Dropdown.Item>
              </DropdownButton> */}
            </div>
            <div className="mx-3">
              <Select
                sx        = {{'.MuiOutlinedInput-notchedOutline': { border: 'none' }, color: 'white', fontSize: '1.5rem', marginTop: '-0.5rem'}}
                labelId   = "simple-select-label"
                id        = "simple-select"
                value     = {String(property)}
                label     = "property"
                onChange  = {handleChangePropertiesSelect}
              >
                <MenuItem value={0}>Inmuebles</MenuItem>
                <MenuItem value={1}>Inmobilarias</MenuItem>
              </Select> 

              
              {/* <DropdownButton 
                  className = {`mt-2`}
                  title     = {(String(property) == '0') ? <span style={{ fontSize: 17}}>Inmuebles</span>:<span style={{ fontSize: 17}}>Inmobilarias</span>}
                  onSelect  = {(e:any) => handleChangePropertiesSelect(String(e))}
              >
                <Dropdown.Item eventKey="0" active={(String(property) == '0') ? true:false}><span style={{ fontSize: 17}}>Inmuebles</span></Dropdown.Item>
                <Dropdown.Item eventKey="1" active={(String(property) == '1') ? true:false}><span style={{ fontSize: 17}}>Inmobilarias</span></Dropdown.Item>
              </DropdownButton> */}
            </div>
          </div>
        ) : (
          <div>
            <br />
            <br />
            <div onClick={cerrarMenu}>
              <Link href="/">
                <span className={styles.headerLinkItem}>Inicio</span>
              </Link>
            </div>
            {hasPermission('properties') &&
              <div onClick={cerrarMenu}>
                <Link href="/perfil/mis-propiedades">
                  <span className={styles.headerLinkItem}>Mis propiedades</span>
                </Link>
              </div>
            }
             {hasPermission('admin.favorites') &&
              <div onClick={cerrarMenu}>
                <Link href="/perfil/mis-favoritos">
                  <span className={styles.headerLinkItem}>Mis favoritos</span>
                </Link>
              </div>
            }
            {hasPermission('profile') &&
              <div onClick={cerrarMenu}>
                <Link href="/perfil">
                  <span className={styles.headerLinkItem}>Mi perfil</span>
                </Link>
              </div>
            }
            {hasPermission('shareproperties') &&
              <div onClick={cerrarMenu}>
                <Link href="/perfil/propiedades-compartidas">
                  <span className={styles.headerLinkItem}>
                    Propiedades compartidas
                  </span>
                </Link>
              </div>
            }
            {hasPermission('estates') &&
              <div onClick={cerrarMenu}>
                <Link href="/perfil/historial-de-inmueble">
                  <span className={styles.headerLinkItem}>
                    Historial de inmueble 
                  </span>
                </Link>
              </div>
            }
  
            {(!(auth.role === "Individual" || auth.role === "Usuario" || auth.role === "UsuarioPagado")) && hasPermission('users') &&
              <div onClick={cerrarMenu}>
                <Link href="/perfil/mis-usuarios">
                  <span className={styles.headerLinkItem}>Mis Usuarios</span>
                </Link>
              </div>
            }
            {(auth.role === "Administrador") && hasPermission('admin.dasboard') && 
              <div onClick={cerrarMenu}>
                <Link href="/dashboard">
                  <span className={styles.headerLinkItem}>Dashboard</span>
                </Link>
              </div>
            }
            <div className="mx-3">
              <Select
                    sx        = {{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                    labelId   = "demo-simple-select-label"
                    id        = "demo-simple-select"
                    value     = {String(location)}
                    label     = "location"
                    onChange  = {handleChangeSelect}
                  >
                    <MenuItem value={0}><img width={30} height={25} src={'https://res.cloudinary.com/dhcyyvrus/image/upload/v1671232286/images/icons8-mexico-48_1_gi2dq6.png'} /></MenuItem>
                    <MenuItem value={1}><img width={30} height={25} src={'https://res.cloudinary.com/dhcyyvrus/image/upload/v1671232286/images/icons8-united-states-48_pxsiqh.png'} /></MenuItem>
              </Select> 
              {/* <DropdownButton 
                  className = {`mt-2`}
                  title     = {<img width={30} height={25} src={(String(location) == '0') ? 'https://res.cloudinary.com/dhcyyvrus/image/upload/v1671232286/images/icons8-mexico-48_1_gi2dq6.png':'https://res.cloudinary.com/dhcyyvrus/image/upload/v1671232286/images/icons8-united-states-48_pxsiqh.png'} />}
                  onSelect  = {(e:any) => handleChangeSelect(String(e))}
              >
                <Dropdown.Item eventKey="0" active={(String(location) == '0') ? true:false}><img width={30} height={25} src={'https://res.cloudinary.com/dhcyyvrus/image/upload/v1671232286/images/icons8-mexico-48_1_gi2dq6.png'} /></Dropdown.Item>
                <Dropdown.Item eventKey="1" active={(String(location) == '1') ? true:false}><img width={30} height={25} src={'https://res.cloudinary.com/dhcyyvrus/image/upload/v1671232286/images/icons8-united-states-48_pxsiqh.png'} /></Dropdown.Item>
              </DropdownButton> */}
            </div>
            <div className="mx-3">
              <Select
                sx        = {{'.MuiOutlinedInput-notchedOutline': { border: 'none' }, color: 'white', fontSize: '1.5rem', marginTop: '-0.5rem'}}
                labelId   = "simple-select-label"
                id        = "simple-select"
                value     = {String(property)}
                label     = "property"
                onChange  = {handleChangePropertiesSelect}
              >
                <MenuItem value={0}>Inmuebles</MenuItem>
                <MenuItem value={1}>Inmobilarias</MenuItem>
              </Select> 

{/*               
              <DropdownButton 
                  className = {`mt-3`}
                  title     = {(String(property) == '0') ? <span style={{ fontSize: 24}}>Inmuebles</span>:<span style={{ fontSize: 17}}>Inmobilarias</span>}
                  onSelect  = {(e:any) => handleChangePropertiesSelect(String(e))}
              >
                <Dropdown.Item eventKey="0" active={(String(property) == '0') ? true:false}><span style={{ fontSize: 17}}>Inmuebles</span></Dropdown.Item>
                <Dropdown.Item eventKey="1" active={(String(property) == '1') ? true:false}><span style={{ fontSize: 17}}>Inmobilarias</span></Dropdown.Item>
              </DropdownButton> */}
            </div>
          </div>
        )}
      </div>
      <LoginModal />
    </div>
  );
};

export default ResponsiveHeader;
