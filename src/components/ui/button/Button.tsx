import { FormEvent } from "react";
import styles from "./Button.module.css";

type Btn = "Primary" | "Secondary" | "Green" | "Add" | "Disabled";

interface Props {
  titulo: string;
  onClick?: any;
  btn?: Btn;
  style?: any;
}

const Button = ({ titulo, onClick, btn = "Primary", style }: Props) => {
  return (
    <>
      {btn === "Primary" ? (
        <button className={`${styles.primary} pointer`} onClick={onClick} style={style}>
          {titulo}
        </button>
      ) : null}
      {btn === "Secondary" ? (
        <div className={`${styles.secondary} pointer`} onClick={onClick} style={style}>
          {titulo}
        </div>
      ) : null}
      {btn === "Green" ? (
        <button className={`${styles.Green} pointer`} onClick={onClick} style={style}>
          <i className="bi bi-plus-lg"></i> {titulo}
        </button>
      ) : null}
      {btn === "Add" ? (
        <button className={`${styles.add} pointer`} onClick={onClick} style={style}>
          {titulo}
        </button>
      ) : null}
      {btn === "Disabled" ? (
        <button disabled className={styles.disabled} style={style}>
          {titulo}
        </button>
      ) : null}
    </>
  );
};
export default Button;
