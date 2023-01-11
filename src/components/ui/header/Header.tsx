import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Container, Nav, Navbar } from "react-bootstrap";
import { gsap } from "gsap";
import Button from "../button/Button";
import styles from "./Header.module.css";
import LoginModal from "../authmodal/LoginModal";
import RegisterModal from "../authmodal/AuthModal";
import { AuthContext } from "../../../context/auth/AuthContext";
import MisChats from "../../paginas/perfil/chats/MisChats";
import { SocketContext } from "context/socket/SocketContext";
import { useSolicitudes, useRequests } from "hooks/useSolicitudes";
import MenuUsuario from "./MenuUsuario";
import Notificaciones from "./Notificaciones";
import { ChatContext } from "context/chat/ChatContext";

import { MapContext } from "../../../context/map/MapContext";
import { Box, InputLabel, MenuItem, FormControl, Select, SelectChangeEvent } from '@mui/material';

//Context
import { useIsProperties } from "../../../hooks/useSolicitudes";
//Middlewares
import { hasPermission } from "../../../middlewares/roles";

const Header                                                = () => {
  const access_token                                        = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
  const { auth, abrirRegistro, abrirLogin }                 = useContext(AuthContext);
  const { showCanvas, handleCloseCanvas, handleShowCanvas } = useContext(ChatContext);
  const { socket }                                          = useContext(SocketContext);
  const [mostrarMenu, setMostrarMenu]                       = useState(false);
  const [notificaciones, setNotificaciones]                 = useState(false);
  const [contador, setContador]                             = useState(0);
  //const { solicitudes, cargando, setSolicitudes }           = useSolicitudes(auth.uid);
  const { requests, loading, setRequests }                  = useRequests((auth && auth.uid)? auth.uid: '', (access_token) ? access_token:'');
  const { loadingProperties, setIsProperties, isProperties }= useIsProperties((auth && auth.uid)? auth.uid: '', (access_token) ? access_token:'');
  const [ location, setLocation ]                           = useState(0);
  const { setUbicacionUsuario, setCoordenadas, property,
    setProperty }                                           = useContext(MapContext);
  const notificacionRef                                     = useRef<HTMLDivElement>(null);
  const target                                              = useRef(null);
  
  useEffect(() => {
    if(socket) {
      socket.on("obtener-solicitud", (solicitud) => {
        setRequests([...requests, solicitud]);
        setContador(requests.length + 1);
        const tl = gsap.timeline();
  
        tl.to(notificacionRef.current, {
          y: -5,
          duration: 0.2,
          ease: "ease.out",
        }).to(notificacionRef.current, {
          y: 0,
          duration: 0.2,
          ease: "bounce.out",
        });
      });

      socket.on("get-property", (property)      => {
        if(property && auth && auth.uid) {
          const properties                      = property.isproperties;

          for(let i=0; i < properties.length; i++) {
            if(properties[i].user.uid == auth.uid) {
              setIsProperties([...isProperties, properties[i]]);
              setContador(isProperties.length + 1);
            }
          }

          const tl                              = gsap.timeline();
          tl.to(notificacionRef.current, {
            y: -5,
            duration: 0.2,
            ease: "ease.out",
          }).to(notificacionRef.current, {
            y: 0,
            duration: 0.2,
            ease: "bounce.out",
          });
        }
      });
    }
  }, [socket]);

  useEffect(() => {
    setContador(requests.length + isProperties.length);
  }, [requests.length, isProperties.length]);

  const handleChangeSelect                                  = (event: SelectChangeEvent) => {
    event.preventDefault();

    if(Number(event.target.value) == 0) {
      setUbicacionUsuario({ lat: 19.4326078, lng: -99.133207 }); 
      setCoordenadas({ lat: 19.4326078, lng: -99.133207 }); 
    }else {
      setUbicacionUsuario({ lat: 25.7825453, lng: -80.2994984 }); 
      setCoordenadas({ lat: 25.7825453, lng: -80.2994984 }); 
    }

    setLocation(Number(event.target.value));
  }

  const handleChangePropertiesSelect                        = (event: SelectChangeEvent) => {
    event.preventDefault();
    
    setProperty(Number(event.target.value));
  }

  // useEffect(() => {
  //   socket?.on("obtener-notificacion", (notificacion) => {
  //     console.log(notificacion, "sa");
  //     setNuevaNotificacion((noti) => [...noti, notificacion]);
  //   });
  // }, []);

  return (
    <Navbar className={styles.navStyle} bg="light" expand="sm">
      <Container>
        <div className="my-2">
          <Link href="/">
            <img
              src="/images/logos/red1-color.png"
              alt="Red 1 a 1"
              className="pointer"
            />
          </Link> 
        </div> 
        <Navbar.Toggle />
        <Navbar.Collapse>
          {!auth.logged ? (
            <Nav className="ms-auto my-2" navbarScroll>
              <Select
                sx        = {{'.MuiOutlinedInput-notchedOutline': { border: 'none' }}}
                labelId   = "demo-simple-select-label"
                id        = "demo-simple-select"
                value     = {String(location)}
                label     = "location"
                onChange  = {handleChangeSelect}
              >
                <MenuItem value={0}><img width={30} height={25} src={'https://res.cloudinary.com/dhcyyvrus/image/upload/v1671232286/images/icons8-mexico-48_1_gi2dq6.png'} /></MenuItem>
                <MenuItem value={1}><img width={30} height={25} src={'https://res.cloudinary.com/dhcyyvrus/image/upload/v1671232286/images/icons8-united-states-48_pxsiqh.png'} /></MenuItem>
              </Select>

              <Select
                sx        = {{'.MuiOutlinedInput-notchedOutline': { border: 'none' }}}
                labelId   = "simple-select-label"
                id        = "simple-select"
                value     = {String(property)}
                label     = "property"
                onChange  = {handleChangePropertiesSelect}
              >
                <MenuItem value={0}>Inmuebles</MenuItem>
                <MenuItem value={1}>Inmobilarias</MenuItem>
              </Select>

              <div
                onClick={abrirRegistro}
                className={`${styles.navEnlace} pointer ms-3`}
              >
                Regístrate
              </div>

              <Button titulo="Inicia sesión" onClick={abrirLogin} />
            </Nav>
          ) : (
            <Nav className="ms-auto my-2" navbarScroll>
               <Select
                  sx        = {{'.MuiOutlinedInput-notchedOutline': { border: 'none' }}}
                  labelId   = "demo-simple-select-label"
                  id        = "demo-simple-select"
                  value     = {String(location)}
                  label     = "location"
                  onChange  = {handleChangeSelect}
                >
                  <MenuItem value={0}><img width={30} height={25} src={'https://res.cloudinary.com/dhcyyvrus/image/upload/v1671232286/images/icons8-mexico-48_1_gi2dq6.png'} /></MenuItem>
                  <MenuItem value={1}><img width={30} height={25} src={'https://res.cloudinary.com/dhcyyvrus/image/upload/v1671232286/images/icons8-united-states-48_pxsiqh.png'} /></MenuItem>
              </Select>

              <Select
                sx        = {{'.MuiOutlinedInput-notchedOutline': { border: 'none' }}}
                labelId   = "simple-select-label"
                id        = "simple-select"
                value     = {String(property)}
                label     = "property"
                onChange  = {handleChangePropertiesSelect}
              >
                <MenuItem value={0}>Inmuebles</MenuItem>
                <MenuItem value={1}>Inmobilarias</MenuItem>
              </Select>
              
              <Link href='/'>
                <div className={`${styles.navEnlace} pointer`} style={{marginTop: '20px'}}>
                  Inicio  
                </div>
              </Link>

              {hasPermission('chats') &&
                <div className="my-1">
                  <Button titulo="chats" onClick={handleShowCanvas} />
                </div>
              }

              <MenuUsuario
                setMostrarMenu={setMostrarMenu}
                target={target}
                setNotificaciones={setNotificaciones}
                mostrarMenu={mostrarMenu}
              />

              {hasPermission('notifications') &&
                <Notificaciones
                  notificaciones          = {notificaciones}
                  setNotificaciones       = {setNotificaciones}
                  target                  = {target}
                  cargando                = {loading || loadingProperties}
                  solicitudes             = {requests}
                  setSolicitudes          = {setRequests}
                  contador                = {contador}
                  setContador             = {setContador}
                  notificacionRef         = {notificacionRef}
                  isProperties            = {isProperties}
                />
              }
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
      <LoginModal />
      <RegisterModal />
      <MisChats showCanvas={showCanvas} handleCloseCanvas={handleCloseCanvas} />
    </Navbar>
  );
};

export default Header;
