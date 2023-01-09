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
import { session, signup, sendPassword, sendEmailWelcome} from '../../services/authService';
import { hasPermission } from '../../services/rolebypermissionService';
import { storeUser, updateUser, destroyUser, showUser, updateProfile } from '../../services/userService';
//Helpers
import { validate } from '../../helpers/response';
//Extras
import Swal from "sweetalert2";

interface ContextProps {
  auth: Auth;
  login:            (email: string, password: string) => Promise<boolean | undefined>;
  forgotPassword :  (email: string) => Promise<boolean | undefined>;
  logOut:           () => void;
  register:         (name: string, lastName: string, email: string, password: string, confirmPassword: string) => Promise<boolean | undefined>;
  validRole:        () =>  Promise<boolean | undefined>;
  createUser:       (name: string, lastName: string, email: string, password: string, confirmPassword: string, ownerId: string, access_token:string) => Promise<boolean | undefined>;
  editUser:         (id: string, name: string, lastName: string, email: string, password: string, confirmPassword: string, access_token:string) => Promise<boolean | undefined>;
  deleteUser:       (id: string, changeId: string, access_token: string) => Promise<boolean | undefined>;
  getUser:          (id: string, access_token: string) => Promise<Auth | Auth[] | undefined>;
  editProfile:      (id: string, name: string, profileCompany: string | null, phone: number | null, officePhone: number | null, lastName: string, companyName: string | null, 
    companyLocation: string, companyLat: number, companyLng: number, website: string | null, facebook: string | null, instagram: string | null, twitter: string | null, youtube: string | null,
    linkedin: string | null, isZone: boolean, nameZone: string | null, latZone: string | null, lngZone: string | null, rangeZone: string | null, categoryZone: string | null, typeZone: string | null, roomsZone: string | null,
    bathsZone: string | null, garagesZone: string | null, minPriceZone: string | null, maxPriceZone: string | null, minGroundZone: string | null, maxGroundZone: string | null, setZone: string | null, minBuildZone: string | null,
    maxBuildZone: string | null, access_token: string) => Promise<boolean | undefined>;
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

export const AuthContext                                    = createContext({} as ContextProps);

const INITIAL_STATE: Auth                                   = {
  uid:                                                      null,
  checking:                                                 true,
  logged:                                                   false,
  nombre:                                                   undefined,
  apellido:                                                 undefined,
  correo:                                                   undefined,
  telefonoOficina:                                          undefined,
  telefonoPersonal:                                         undefined,
  direccionFisica:                                          undefined,
  sitioweb:                                                 undefined,
  facebookpage:                                             undefined,
  instagram:                                                undefined,
  nombreInmobiliaria:                                       undefined,
  twitter:                                                  undefined,
  youtube:                                                  undefined,
  perfilEmpresarial:                                        undefined,
  linkedin:                                                 undefined,
  img:                                                      undefined,
  logo:                                                     undefined,
  role:                                                     undefined,
  paqueteAdquirido:                                         undefined,
  usuarios:                                                 undefined,
  propietario:                                              undefined,
  google:                                                   undefined,
  recibirCorreo:                                            false,
  ownerId:                                                  null,
  lat:                                                      0,
  lng:                                                      0
};

export const AuthProvider: FC = ({ children }) => {
  const [auth, setAuth]                                     = useState(INITIAL_STATE);
  const router                                              = useRouter();
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
      validate(response.errors);
      return false;
    }

    if(response && response.ok) {
      toast.error(response.msg);
      return false;
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
        ownerId:                                            (data.user.ownerId) ? data.user.ownerId:null,
        lat:                                                (data.user.lat) ? data.user.lat:0,
        lng:                                                (data.user.lng) ? data.user.lng:0
      };
      
      if(data.user.role && data.user.correo && (typeof data.user.correo == 'string')) {
        localStorage.setItem("email", data.user.correo); 
        localStorage.setItem("role", data.user.role);
      }
  
      localStorage.setItem("token", (data.access_token) ? data.access_token:'');
      setAuth(auth);

      const permissions                                     = await hasPermission((typeof data.user.role == 'string') ? data.user.role:'', (data.access_token) ? data.access_token:'');

      if(permissions && permissions.data) {
        localStorage.setItem("permissions", permissions.data.rolebypermissions);
      }

      return true;
    }
  }
  const forgotPassword                                      = async (email: string) => {

    const response                                          = await sendPassword(email);

    //Validation 
    if(response && response.errors) {
      validate(response.errors);
      return false;
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

    return true;
  }
  const register                                            = async (name: string, lastName: string, email: string, password: string, confirmPassword: string ) => {

    const response                                          = await signup(name, lastName, email, password, confirmPassword);

    //Validation 
    if(response && response.errors) {
      validate(response.errors);
      return false;
    }

    if(response && response.ok) {
      toast.error(response.msg);
      return false;
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
        ownerId:                                            null
      };
      
      if(data.user.correo && (typeof data.user.correo == 'string')) {
        localStorage.setItem("email", data.user.correo); 
      }

      localStorage.setItem("role", 'Usuario');
      localStorage.setItem("token", (data.access_token) ? data.access_token:'');
      setAuth(auth);


      const permissions                                     = await hasPermission('Usuario', (data.access_token) ? data.access_token:'');

      if(permissions && permissions.data) {
        localStorage.setItem("permissions", permissions.data.rolebypermissions);
      }

      return true;
    }
  }
  const validRole                                           = async () => {

    const role                                              = (typeof window !== "undefined") ? localStorage.getItem("role"):"";
    const email                                             = (typeof window !== "undefined") ? localStorage.getItem("email"):"";

    if(!role || !email) {
      return false;
    }

    if((role == 'Usuario') && ((email != 'Eduardoest@internet360.com.mx') && (email != 'Eduardoest@i360.com.mx') && (email != 'francisco@i360.com.mx') && (email != 'jorge.katz1619@gmail.com'))) {
      return false;
    }

    return true;
  }
  const createUser                                          = async (name: string, lastName: string, email: string, password: string, confirmPassword: string, ownerId: string, access_token: string) => {
    
    if(name && lastName && email && password && confirmPassword && ownerId && access_token) {
      const response                                        = await storeUser(name, lastName, email, password, confirmPassword, ownerId, access_token);

      //Validation 
      if(response && response.errors) {
        validate(response.errors);
        return false;
      }

      if(response && response.ok) {
        toast.error(response.msg);
        return false;
      }

      if(response && response.data) {
        
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

        return true;
      }
    }
  }
  const editUser                                            = async (id: string, name: string, lastName: string, email: string, password: string, confirmPassword: string, access_token: string) => {
    if(id && name && lastName && email && access_token) {
      const response                                        = await updateUser(id, name, lastName, email, password, confirmPassword, access_token);

      //Validation 
      if(response && response.errors) {
        validate(response.errors);
        return false;
      }

      if(response && response.ok) {
        toast.error(response.msg);
        return false;
      }

      if(response && response.data) {
        
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

        return true;
      }
    }
  }
  const deleteUser                                          = async (id: string, changeId: string, access_token: string) => {
    if(id && access_token) {
      const response                                        = await destroyUser(id, changeId, access_token);

      //Validation 
      if(response && response.errors) {
        validate(response.errors);
        return false;
      }

      if(response && response.ok) {
        toast.error(response.msg);
        return false;
      }

      if(response && response.data) {
        
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

        return true;
      }
    }
  }
  const getUser                                             = async (id: string, access_token: string) => {
    if(id && access_token) {
      const response                                        = await showUser(id, access_token);

      if(response && response.data){
        return response.data.users;
      }
    }
  }
  const editProfile                                         = async (id: string, name: string, profileCompany: string | null, phone: number | null, officePhone: number | null, lastName: string, companyName: string | null, 
    companyLocation: string, companyLat: number, companyLng: number, website: string | null, facebook: string | null, instagram: string | null, twitter: string | null, youtube: string | null,
    linkedin: string | null, isZone: boolean, nameZone: string | null, latZone: string | null, lngZone: string | null, rangeZone: string | null, categoryZone: string | null, typeZone: string | null, roomsZone: string | null,
    bathsZone: string | null, garagesZone: string | null, minPriceZone: string | null, maxPriceZone: string | null, minGroundZone: string | null, maxGroundZone: string | null, setZone: string | null, minBuildZone: string | null,
    maxBuildZone: string | null, access_token: string) => {
      if(id && name && lastName && companyLocation && String(companyLat) && String(companyLng) && access_token) {
        const response                                      = await updateProfile(id, name, profileCompany, phone, officePhone, lastName, companyName, companyLocation, companyLat, companyLng, website, facebook, instagram, twitter, youtube,
                                                              linkedin, isZone, nameZone, latZone, lngZone, rangeZone, categoryZone, typeZone, roomsZone, bathsZone, garagesZone, minPriceZone, maxPriceZone, minGroundZone, maxGroundZone, 
                                                              setZone, minBuildZone, maxBuildZone, access_token);

        if(response && response.errors) {
          validate(response.errors);
          return false;
        }

        if(response && response.ok) {
          toast.error(response.msg);
          return false;
        }

        if(response && response.data) {
          
          console.log(response.data);
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

          return true;
        }   
      }
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
        ownerId: null
      });
    }

    return resp;
  };

  const verificaToken = useCallback(async () => {
    const token = (typeof window !== "undefined") ? localStorage.getItem("token"):"";

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
        ownerId: null
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
        ownerId: null
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
        ownerId: null
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
      ownerId: null
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
        ownerId: null
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
        ownerId: null
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
        ownerId: null
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
        ownerId: null
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
        createUser,
        editUser,
        deleteUser,
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
        forgotPassword,
        getUser,
        editProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
