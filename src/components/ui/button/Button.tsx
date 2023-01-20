import { FormEvent } from "react";
import styles from "./Button.module.css";

type Btn = "Primary" | "Secondary" | "Green" | "Add" | "Disabled" | "Danger" | "Filter";

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
      {(btn === "Filter") &&
        <button type={(typeof type != 'string') ? type:"submit"} className={`${styles.Green} pointer`} onClick={onClick} style={style}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-filter mx-1" viewBox="0 0 16 16">
            <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
          </svg>
          {titulo}
        </button>
      }
    </>
  );
};
export default Button;
