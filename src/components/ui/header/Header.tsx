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
import { useSolicitudes } from "hooks/useSolicitudes";
import MenuUsuario from "./MenuUsuario";
import Notificaciones from "./Notificaciones";
import { ChatContext } from "context/chat/ChatContext";

import { MapContext } from "../../../context/map/MapContext";
import SortIcon from '@material-ui/icons/ArrowDropDown';
import { Box, InputLabel, MenuItem, FormControl, Select, SelectChangeEvent } from '@mui/material';

//Middlewares
import { hasPermission } from "../../../middlewares/roles";

// interface Notificacion {
//   de: string;
//   para: string;
//   nombre: string;
//   apellido: string;
//   mensaje: string;
// }

const Header = () => {
  const { auth, abrirRegistro, abrirLogin } = useContext(AuthContext);
  const { showCanvas, handleCloseCanvas, handleShowCanvas } =
    useContext(ChatContext);
  const { socket } = useContext(SocketContext);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const target = useRef(null);
  const [notificaciones, setNotificaciones] = useState(false);
  const [contador, setContador] = useState(0);
  const { solicitudes, cargando, setSolicitudes } = useSolicitudes(auth.uid);
  const notificacionRef = useRef<HTMLDivElement>(null);
  // const [nuevaNotificacion, setNuevaNotificacion] =
  //   useState<Notificacion[]>([]);
  // const uniqueValues = new Set();

  
  const [ location, setLocation ]                 = useState(0);
  const { setUbicacionUsuario, setCoordenadas }   = useContext(MapContext);

  useEffect(() => {
    socket?.on("obtener-solicitud", (solicitud) => {
      setSolicitudes([...solicitudes, solicitud]);
      setContador(solicitudes.length + 1);
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
  }, [socket]);

  useEffect(() => {
    setContador(solicitudes.length);
  }, [solicitudes.length]);

const handleChangeSelect = (event: SelectChangeEvent) => {

    if(Number(event.target.value) == 0) {
      setUbicacionUsuario({ lat: 19.4326078, lng: -99.133207 }); 
      setCoordenadas({ lat: 19.4326078, lng: -99.133207 }); 
    }else {
      setUbicacionUsuario({ lat: 25.7825453, lng: -80.2994984 }); 
      setCoordenadas({ lat: 25.7825453, lng: -80.2994984 }); 
    }

    setLocation(Number(event.target.value));
  };

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
                sx        = {{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                labelId   = "demo-simple-select-label"
                id        = "demo-simple-select"
                value     = {String(location)}
                label     = "location"
                onChange  = {handleChangeSelect}
              >
                <MenuItem value={0}>Ciudad de México</MenuItem>
                <MenuItem value={1}>Miami</MenuItem>
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
                  sx        = {{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                  labelId   = "demo-simple-select-label"
                  id        = "demo-simple-select"
                  value     = {String(location)}
                  label     = "location"
                  onChange  = {handleChangeSelect}
                >
                  <MenuItem value={0}>Ciudad de México</MenuItem>
                  <MenuItem value={1}>Miami</MenuItem>
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
                  notificaciones={notificaciones}
                  setNotificaciones={setNotificaciones}
                  target={target}
                  cargando={cargando}
                  solicitudes={solicitudes}
                  setSolicitudes={setSolicitudes}
                  contador={contador}
                  setContador={setContador}
                  notificacionRef={notificacionRef}
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
