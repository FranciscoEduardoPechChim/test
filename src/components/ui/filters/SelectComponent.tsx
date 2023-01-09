//React
import { Container, Form } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
//Content
import { AuthContext } from "context/auth/AuthContext";
import { InmuebleContext } from "context/inmuebles/InmuebleContext";
//Components
import Loading from "components/ui/loading/Loading";
//Services
import { getUsersByProperties } from '../../../services/followerService';
//Extras
import styles from './SelectComponent.module.css';

interface Props {
    type: string;
}

const SelectComponent                               = ({ type }:Props) => {
    const access_token                              = (typeof window !== "undefined") ? localStorage.getItem("token"):"";
    const { auth }                                  = useContext(AuthContext);
    const { status, setStatus, userId, setUserId }  = useContext(InmuebleContext);
    const [loading, setLoading]                     = useState(false);
    const [userFollowers, setUserFollowers]         = useState<any>([]);
    let body                                        = null;

    const init                                      = async () => {
        switch(type) {
            case 'propertiesFollowers':
                if(auth && auth.uid && String(status) && access_token) {
                    setLoading(true);
                    
                    const response                  = await getUsersByProperties(auth.uid, Number(status), access_token);
              
                    if(response && response.data) {
                        const { followers }         = response.data;
         
                        setUserFollowers(followers);
                    }

                    setLoading(false);
                }
            break;
        }
    }

    useEffect(() => {
        init();
    }, [status]);
    
    switch(type) {
        case 'propertiesFollowers':
            body =  
            <Container>
                <div className="container mt-4">
                    <div className="row d-flex justify-content-end">
                        <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4">
                            {(loading) ? <Loading />: null

                            }
                            <Form.Select
                                className   = {`${styles.customSelect} mb-4`}
                                value       = {userId}
                                onChange    = {(e) => setUserId(e.target.value)}
                            >
                                <option value="all">Todos</option>

                                {(userFollowers && (userFollowers.length != 0)) && userFollowers.map((item:any, key: number) => {
                                    return (
                                        <option key={key} value={(Number(status) == 0) ? item.owner.uid:item.user.uid}>{(Number(status) == 0) ? (item.owner.nombre + ' ' +  item.owner.apellido):(item.user.nombre + ' ' +  item.user.apellido)}</option>
                                    );
                                })}
                            </Form.Select>
                        </div> 
                        <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4">
                            <Form.Select
                                className   = {`${styles.customSelect} mb-4`}
                                value       = {status}
                                onChange    = {(e) => setStatus(Number(e.target.value))}
                            >
                                <option value={0}>Propiedades que sigo</option>
                                <option value={1}>Propiedades que me siguen</option>
                            </Form.Select>
                        </div>
                    </div>
                </div>
            </Container>;
        break;
    }

    return body;
};

export default SelectComponent;