import styles from "./ModalTitle.module.css";

interface Props {
  titulo: string;
}

const Modaltitle2 = ({ titulo }: Props) => {
  return (
    <div className="text-center">
      <h3 className={styles.loginTitle}>{titulo}</h3>
      <div className={styles.line2} />
    </div>
  );
};

export default Modaltitle2;
