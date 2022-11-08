import { useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import styles from "./Dashboard.module.css";
import { AuthContext } from "context/auth/AuthContext";

interface Props {
  handleToggleSidebar: (value: boolean) => void;
  toggled: boolean;
  collapsed: boolean;
}

const Sidebar = ({ handleToggleSidebar, toggled, collapsed }: Props) => {
  const { logOut } = useContext(AuthContext);
  const router = useRouter();

  const goToHome = () => router.push("/");
  return (
    <ProSidebar
      toggled={toggled}
      collapsed={collapsed}
      onToggle={handleToggleSidebar}
      breakPoint="md"
      className={styles.sidebarposition}
    >
      <Menu iconShape="square" className="mx-2">
        <SidebarHeader className="text-center mb-2">
          <br />
          <img
            className="pointer"
            onClick={goToHome}
            src="/images/logos/red1-color.png"
            alt="Red 1 a 1"
          />
          <br />
          <br />
        </SidebarHeader>
        <SidebarContent className="py-4">
          <MenuItem>
            <i className="bi bi-grid-3x3 me-2" />
            <Link href="/dashboard">Resumen</Link>
          </MenuItem>
          <MenuItem>
            <i className="bi bi-people-fill me-2"></i>
            <Link href="/dashboard/Usuarios">Usuarios</Link>
          </MenuItem>
          <MenuItem>
            <i className="bi bi-house-fill me-2"></i>
            <Link href="/dashboard/Inmuebles">Inmuebles</Link>
          </MenuItem>
          {/* <MenuItem>
            <i className="bi bi-tags-fill me-2"></i>
            <Link href="/dashboard/categorias">Categorías</Link>
          </MenuItem>
          <MenuItem>
            <i className="bi bi-building me-2"></i> Tipo de propiedad
          </MenuItem> */}
          <MenuItem>
            <i className="bi bi-wallet2 me-2"></i>
            <Link href="/dashboard/pagos/wallet">Wallet</Link>
          </MenuItem>
          <MenuItem>
            <i className="bi bi-gift me-2"></i>
            <Link href="/dashboard/promotions">Promociones</Link>
          </MenuItem> 
          <MenuItem>
            <i className="bi bi-receipt-cutoff me-2"></i>
            <Link href="/dashboard/pagos/referencias">Referencias</Link>
          </MenuItem>
        </SidebarContent>

        {/* <div className={styles.position}>
          <MenuItem onClick={logOut}>
            <i className="bi bi-person-x-fill me-2" />
            Cerrar sesión
          </MenuItem>
        </div> */}
      </Menu>
    </ProSidebar>
  );
};

export default Sidebar;
