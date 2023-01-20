import { useRouter } from "next/router";
import DashboardLayout from "components/layout/Dashboard";
import SEO from "components/seo/SEO";
import { AdminRoute } from "hooks/useAdminRoute";
import { Form } from "react-bootstrap";
import styleRef from "components/paginas/dashboard/Referencias.module.css";
import styles from './dashboard.module.css'

//Components
import Users from '../../components/paginas/dashboard/users/Users';


const Usuarios      = () => {
    const router    = useRouter();


    return (
        <>
            <SEO titulo="Usuarios" url={router.asPath} />
            <DashboardLayout titulo="USUARIOS">
               <Users />
            </DashboardLayout>
        </>
    )
}

export default AdminRoute(Usuarios)
