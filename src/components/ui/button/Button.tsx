import { FormEvent } from "react";
import styles from "./Button.module.css";

type Btn = "Primary" | "Secondary" | "Green" | "Add" | "Disabled" | "Danger";

interface Props {
  titulo: string;
  onClick?: any;
  btn?: Btn;
  type?: string;
  style?: any;
}

const Button = ({ titulo, onClick, type, btn = "Primary", style }: Props) => {
  return (
    <>
      {btn === "Primary" ? (
        <button type={(typeof type != 'string') ? type:"submit"} className={`${styles.primary} pointer`} onClick={onClick} style={style}>
          {titulo}
        </button>
      ) : null}
      {btn === "Secondary" ? (
        <div className={`${styles.secondary} pointer`} onClick={onClick} style={style}>
          {titulo}
        </div>
      ) : null}
      {btn === "Green" ? (
        <button type={(typeof type != 'string') ? type:"submit"} className={`${styles.Green} pointer`} onClick={onClick} style={style}>
          <i className="bi bi-plus-lg"></i> {titulo}
        </button>
      ) : null}
      {btn === "Add" ? (
        <button type={(typeof type != 'string') ? type:"submit"} className={`${styles.add} pointer`} onClick={onClick} style={style}>
          {titulo}
        </button>
      ) : null}
      {btn === "Disabled" ? (
        <button type={(typeof type != 'string') ? type:"submit"} disabled className={styles.disabled} style={style}>
          {titulo}
        </button>
      ) : null}

      {(btn === "Danger")  &&
        <button type={(typeof type != 'string') ? type:"submit"} className={`${styles.Danger} pointer`} style={style}>
          {titulo}
        </button>
      }
    </>
  );
};
export default Button;
