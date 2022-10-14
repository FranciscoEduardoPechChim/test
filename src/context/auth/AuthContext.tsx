import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import {
  actualizarPerfilFetch,
  actualizarRolUsuario,
  crearUsuarioFetch,
  fetchConToken,
  fetchSinToken,
  googleLogin,
  subirFotoPerfil,
} from "../../helpers/fetch";
import { Auth, Resp, SubirFoto } from "../../interfaces/AuthInterface";
import { RespActualizar } from "../../interfaces/UserInterface";

//Services
import { session, signup, sendPassword} from '../../services/authService';
//Helpers
import { validate } from '../../helpers/response';
//Extras
import Swal from "sweetalert2";

interface ContextProps {
  auth: Auth;
  login:            (email: string, password: string) => any;
  forgotPassword :  (email: string) => any;
  logOut:           () => void;
  register:         (name: string, lastName: string, email: string, password: string, role: string) => any;
  validRole:        () =>  boolean;
  crearUsuario: (
    nombre: string,
    apellido: string,
    correo: string,
    password: string,
    role: string,
    propietario: string | undefined | null
  ) => Promise<Resp>;
  signInWithGoogle: (response: any) => void /* response:GoogleLoginResponse */;
  signInWithFacebook: () => void;
  verificaToken: () => void;
  actualizarPerfil: (data: any) => Promise<RespActualizar>;
  fotoPerfil: (data: any) => Promise<SubirFoto>;
  mostrarLogin: boolean;
  mostrarRegistro: boolean;
  setMostrarLogin: Dispatch<SetStateAction<boolean>>;
  setMostrarRegistro: Dispatch<SetStateAction<boolean>>;
  abrirLogin: () => void;
  cerrarLogin: () => void;
  abrirRegistro: () => void;
  cerrarRegistro: () => void;
  mostrarPasswordForget: boolean;
  setMostrarPasswordForget: Dispatch<SetStateAction<boolean>>;
  abrirPasswordForget: () => void;
  cerrarPasswordForget: () => void;
  actualizarRol: (
    data: any,
    uid: string | undefined | null
  ) => Promise<RespActualizar>;
}

export const AuthContext = createContext({} as ContextProps);

const initialState: Auth = {
  uid: null,
  checking: true,
  logged: false,
  nombre: undefined,
  apellido: undefined,
  correo: undefined,
  telefonoOficina: undefined,
  telefonoPersonal: undefined,
  direccionFisica: undefined,
  sitioweb: undefined,
  facebookpage: undefined,
  instagram: undefined,
  nombreInmobiliaria: undefined,
  twitter: undefined,
  youtube: undefined,
  perfilEmpresarial: undefined,
  linkedin: undefined,
  img: undefined,
  logo: undefined,
  role: undefined,
  paqueteAdquirido: undefined,
  usuarios: undefined,
  propietario: undefined,
  google: undefined,
  recibirCorreo: false,
};

export const AuthProvider: FC = ({ children }) => {
  const [auth, setAuth] = useState(initialState);
  const router = useRouter();
  const [mostrarLogin, setMostrarLogin]                     = useState(false);
  const [mostrarRegistro, setMostrarRegistro]               = useState(false);
  const [mostrarPasswordForget, setMostrarPasswordForget]   = useState(false);

  const abrirLogin                                          = () => setMostrarLogin(true);
  const cerrarLogin                                         = () => setMostrarLogin(false);
  const abrirRegistro                                       = () => setMostrarRegistro(true);
  const cerrarRegistro                                      = () => setMostrarRegistro(false);
  const abrirPasswordForget                                 = () => setMostrarPasswordForget(true);
  const cerrarPasswordForget                                = () => setMostrarPasswordForget(false);

  const login                                               = async (email: string, password: string) => {

    const response                                          = await session(email, password);

    //Validation 
    if(response && response.errors) {
      return validate(response.errors);
    }

    if(response && response.ok) {
      return toast.error(response.msg);
    }

    if(response && response.data) {
      const { data }                                        = response;

      const auth                                            = {
        uid:                                                data.user.uid,
        checking:                                           false,
        logged:                                             true,
        nombre:                                             data.user.nombre,
        apellido:                                           data.user.apellido,
        correo:                                             data.user.correo,
        direccionFisica:                                    data.user.direccionFisica,
        sitioweb:                                           data.user.sitioweb,
        facebookpage:                                       data.user.facebookpage,
        instagram:                                          data.user.instagram,
        nombreInmobiliaria:                                 data.user.nombreInmobiliaria,
        telefonoOficina:                                    data.user.telefonoOficina,
        telefonoPersonal:                                   data.user.telefonoPersonal,
        twitter:                                            data.user.twitter,
        youtube:                                            data.user.youtube,
        perfilEmpresarial:                                  data.user.perfilEmpresarial,
        linkedin:                                           data.user.linkedin,
        img:                                                data.user.img,
        logo:                                               data.user.logo,
        role:                                               data.user.role,
        paqueteAdquirido:                                   data.user.paqueteAdquirido,
        usuarios:                                           data.user.usuarios,
        propietario:                                        data.user.propietario,
        google:                                             undefined,
        recibirCorreo:                                      data.user.recibirCorreo,
      };
      
      localStorage.setItem("role", "Usuario");
      localStorage.setItem("token", data.access_token);
      setAuth(auth);

      return {
        token:    data.access_token,
        ok:       response.ok,
        usuario:  data.user
      };
    }
  }
  const forgotPassword                                      = async (email: string) => {

    const response                                          = await sendPassword(email);

    //Validation 
    if(response && response.errors) {
      return validate(response.errors);
    }


    if(response) {
      Swal.fire({
        title: '',
        html: response.msg,
        icon: 'success',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      });
    }

    return {
      ok:       response?.ok,
      msg:      response?.msg
    };
  }
  const register                                            = async (name: string, lastName: string, email: string, password: string, role: string ) => {

    const response                                          = await signup(name, lastName, email, password, role);
  
    //Validation 
    if(response && response.errors) {
      return validate(response.errors);
    }

    if(response && response.ok) {
      return toast.error(response.msg);
    }

    if(response && response.data) {
      const { data }                                        = response;

      const auth                                            = {
        uid:                                                data.user.uid,
        checking:                                           false,
        logged:                                             true,
        nombre:                                             data.user.nombre,
        apellido:                                           data.user.apellido,
        correo:                                             data.user.correo,
        direccionFisica:                                    data.user.direccionFisica,
        sitioweb:                                           data.user.sitioweb,
        facebookpage:                                       data.user.facebookpage,
        instagram:                                          data.user.instagram,
        nombreInmobiliaria:                                 data.user.nombreInmobiliaria,
        telefonoOficina:                                    data.user.telefonoOficina,
        telefonoPersonal:                                   data.user.telefonoPersonal,
        twitter:                                            data.user.twitter,
        youtube:                                            data.user.youtube,
        perfilEmpresarial:                                  data.user.perfilEmpresarial,
        linkedin:                                           data.user.linkedin,
        img:                                                data.user.img,
        logo:                                               data.user.logo,
        role:                                               data.user.role,
        paqueteAdquirido:                                   data.user.paqueteAdquirido,
        usuarios:                                           data.user.usuarios,
        propietario:                                        data.user.propietario,
        google:                                             undefined,
        recibirCorreo:                                      data.user.recibirCorreo,
      };
      
      localStorage.setItem("role", 'Usuario');
      localStorage.setItem("token", data.access_token);
      setAuth(auth);

      return {
        token:    data.access_token,
        ok:       response.ok,
        usuario:  data.user
      };
    }
  }
  const validRole                                           = () => {
    const role                                              = localStorage.getItem("role");

    if(!role) {
      return false;
    }

    if(role == 'Usuario') {
      return false;
    }

    return true;
  }

  const crearUsuario = async (
    nombre: string,
    apellido: string,
    correo: string,
    password: string,
    role: string,
    propietario: string | undefined | null
  ): Promise<Resp> => {
    const resp = await crearUsuarioFetch("usuarios/propietario", {
      nombre,
      apellido,
      correo,
      password,
      role,
      propietario,
    });
    if (resp.token) {
      localStorage.setItem("token", resp.token);
      const { usuario } = resp;
      setAuth({
        uid: usuario.uid,
        checking: false,
        logged: true,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        direccionFisica: usuario.direccionFisica,
        sitioweb: usuario.sitioweb,
        facebookpage: usuario.facebookpage,
        instagram: usuario.instagram,
        nombreInmobiliaria: usuario.nombreInmobiliaria,
        telefonoOficina: usuario.telefonoOficina,
        telefonoPersonal: usuario.telefonoPersonal,
        twitter: usuario.twitter,
        youtube: usuario.youtube,
        perfilEmpresarial: usuario.perfilEmpresarial,
        linkedin: auth.linkedin,
        img: usuario.img,
        logo: usuario.logo,
        role: usuario.role,
        paqueteAdquirido: usuario.paqueteAdquirido,
        usuarios: usuario.usuarios,
        propietario: usuario.propietario,
        google: undefined,
        recibirCorreo: usuario.recibirCorreo,
      });
    }

    return resp;
  };

  const verificaToken = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuth({
        uid: null,
        checking: true,
        logged: false,
        nombre: undefined,
        apellido: undefined,
        correo: undefined,
        telefonoOficina: undefined,
        telefonoPersonal: undefined,
        direccionFisica: undefined,
        sitioweb: undefined,
        facebookpage: undefined,
        instagram: undefined,
        nombreInmobiliaria: undefined,
        twitter: undefined,
        youtube: undefined,
        perfilEmpresarial: undefined,
        linkedin: undefined,
        img: undefined,
        logo: undefined,
        role: undefined,
        paqueteAdquirido: undefined,
        usuarios: undefined,
        propietario: undefined,
        google: undefined,
        recibirCorreo: false,
      });

      return false;
    }

    const resp = await fetchConToken("auth/renovarToken");

    if (resp.ok) {
      localStorage.setItem("token", resp.token);
      const { usuario } = resp;
      setAuth({
        uid: usuario.uid,
        checking: false,
        logged: true,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        direccionFisica: usuario.direccionFisica,
        sitioweb: usuario.sitioweb,
        facebookpage: usuario.facebookpage,
        instagram: usuario.instagram,
        nombreInmobiliaria: usuario.nombreInmobiliaria,
        telefonoOficina: usuario.telefonoOficina,
        telefonoPersonal: usuario.telefonoPersonal,
        twitter: usuario.twitter,
        youtube: usuario.youtube,
        perfilEmpresarial: usuario.perfilEmpresarial,
        linkedin: usuario.linkedin,
        img: usuario.img,
        logo: usuario.logo,
        role: usuario.role,
        paqueteAdquirido: usuario.paqueteAdquirido,
        usuarios: usuario.usuarios,
        propietario: usuario.propietario,
        google: true,
        recibirCorreo: usuario.recibirCorreo,
      });
      return true;
    } else {
      setAuth({
        uid: null,
        checking: false,
        logged: false,
        nombre: undefined,
        apellido: undefined,
        correo: undefined,
        telefonoOficina: undefined,
        telefonoPersonal: undefined,
        direccionFisica: undefined,
        sitioweb: undefined,
        facebookpage: undefined,
        instagram: undefined,
        nombreInmobiliaria: undefined,
        twitter: undefined,
        youtube: undefined,
        perfilEmpresarial: undefined,
        linkedin: undefined,
        img: undefined,
        logo: undefined,
        role: undefined,
        paqueteAdquirido: undefined,
        usuarios: undefined,
        propietario: undefined,
        google: undefined,
        recibirCorreo: false,
      });

      return false;
    }
  }, []);

  const logOut = async () => {
    localStorage.removeItem("token");
    setAuth({
      uid: null,
      checking: false,
      logged: false,
      nombre: undefined,
      apellido: undefined,
      correo: undefined,
      telefonoOficina: undefined,
      telefonoPersonal: undefined,
      direccionFisica: undefined,
      sitioweb: undefined,
      facebookpage: undefined,
      instagram: undefined,
      nombreInmobiliaria: undefined,
      twitter: undefined,
      youtube: undefined,
      perfilEmpresarial: undefined,
      linkedin: undefined,
      img: undefined,
      logo: undefined,
      role: undefined,
      paqueteAdquirido: undefined,
      usuarios: undefined,
      propietario: undefined,
      google: undefined,
      recibirCorreo: false,
    });
  };

  const actualizarPerfil = async (formulario: any) => {
    const resp = await actualizarPerfilFetch(
      "usuarios/" + auth.uid,
      formulario
    );
    const { usuario } = resp;

    if (resp.ok) {
      setAuth({
        uid: usuario.uid,
        checking: false,
        logged: true,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        direccionFisica: usuario.direccionFisica,
        sitioweb: usuario.sitioweb,
        facebookpage: usuario.facebookpage,
        instagram: usuario.instagram,
        nombreInmobiliaria: usuario.nombreInmobiliaria,
        telefonoOficina: usuario.telefonoOficina,
        telefonoPersonal: usuario.telefonoPersonal,
        twitter: usuario.twitter,
        youtube: usuario.youtube,
        perfilEmpresarial: usuario.perfilEmpresarial,
        linkedin: usuario.linkedin,
        img: usuario.img,
        logo: usuario.logo,
        role: usuario.role,
        paqueteAdquirido: usuario.paqueteAdquirido,
        usuarios: usuario.usuarios,
        propietario: usuario.propietario,
        google: undefined,
        recibirCorreo: usuario.recibirCorreo,
      });

      toast.success(resp.msg);
      router.push("/perfil");
    }

    if (!resp.ok) {
      resp.errors.map((error) => {
        toast.error(error.msg);
      });
    }

    return resp;
  };

  const actualizarRol = async (data: any, uid: string | undefined | null) => {
    const resp = await actualizarRolUsuario(`usuarios/rol/${uid}`, data);
    const { usuario } = resp;
    if (resp.ok) {
      setAuth({
        uid: usuario.uid,
        checking: false,
        logged: true,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        direccionFisica: usuario.direccionFisica,
        sitioweb: usuario.sitioweb,
        facebookpage: usuario.facebookpage,
        instagram: usuario.instagram,
        nombreInmobiliaria: usuario.nombreInmobiliaria,
        telefonoOficina: usuario.telefonoOficina,
        telefonoPersonal: usuario.telefonoPersonal,
        twitter: usuario.twitter,
        youtube: usuario.youtube,
        perfilEmpresarial: usuario.perfilEmpresarial,
        linkedin: usuario.linkedin,
        img: usuario.img,
        logo: usuario.logo,
        role: usuario.role,
        paqueteAdquirido: usuario.paqueteAdquirido,
        usuarios: usuario.usuarios,
        propietario: usuario.propietario,
        google: undefined,
        recibirCorreo: usuario.recibirCorreo,
      });
    }

    return resp;
  };

  const fotoPerfil = async (formData: any) => {
    const resp = await subirFotoPerfil(
      `subidas/usuarios/${auth.uid}`,
      formData
    );

    const { usuario } = resp;

    if (resp.ok) {
      setAuth({
        uid: usuario.uid,
        checking: false,
        logged: true,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        direccionFisica: usuario.direccionFisica,
        sitioweb: usuario.sitioweb,
        facebookpage: usuario.facebookpage,
        instagram: usuario.instagram,
        nombreInmobiliaria: usuario.nombreInmobiliaria,
        telefonoOficina: usuario.telefonoOficina,
        telefonoPersonal: usuario.telefonoPersonal,
        twitter: usuario.twitter,
        youtube: usuario.youtube,
        perfilEmpresarial: usuario.perfilEmpresarial,
        linkedin: usuario.linkedin,
        img: usuario.img,
        logo: usuario.logo,
        role: usuario.role,
        paqueteAdquirido: usuario.paqueteAdquirido,
        usuarios: usuario.usuarios,
        propietario: usuario.propietario,
        google: undefined,
        recibirCorreo: usuario.recibirCorreo,
      });

      toast.success(resp.msg);
    }

    return resp;
  };

  const signInWithGoogle = async (response: any) => {
    /* response:GoogleLoginResponse */
    const id_token = response.getAuthResponse().id_token;
    const body = { id_token };

    const res = await googleLogin("auth/google", body);

    if (res.ok) {
      localStorage.setItem("token", res.token);
      const { usuario } = res;
      setAuth({
        uid: usuario.uid,
        checking: false,
        logged: true,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        direccionFisica: usuario.direccionFisica,
        sitioweb: usuario.sitioweb,
        facebookpage: usuario.facebookpage,
        instagram: usuario.instagram,
        nombreInmobiliaria: usuario.nombreInmobiliaria,
        telefonoOficina: usuario.telefonoOficina,
        telefonoPersonal: usuario.telefonoPersonal,
        twitter: usuario.twitter,
        youtube: usuario.youtube,
        perfilEmpresarial: usuario.perfilEmpresarial,
        linkedin: usuario.linkedin,
        img: usuario.img,
        logo: usuario.logo,
        role: usuario.role,
        paqueteAdquirido: usuario.paqueteAdquirido,
        usuarios: usuario.usuarios,
        propietario: usuario.propietario,
        google: true,
        recibirCorreo: usuario.recibirCorreo,
      });
    }
    setMostrarLogin(false);
    setMostrarRegistro(false);
    return res;
  };

  const signInWithFacebook = async () => {
    console.log("Iniciando sesión con facebook");
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        logOut,
        register,
        validRole,
        signInWithGoogle,
        signInWithFacebook,
        verificaToken,
        actualizarPerfil,
        fotoPerfil,
        mostrarLogin,
        mostrarRegistro,
        setMostrarLogin,
        setMostrarRegistro,
        abrirLogin,
        cerrarLogin,
        abrirRegistro,
        cerrarRegistro,
        actualizarRol,
        crearUsuario,
        mostrarPasswordForget,
        setMostrarPasswordForget,
        abrirPasswordForget,
        cerrarPasswordForget,
        forgotPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
