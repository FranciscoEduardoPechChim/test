//React
import { ToastContainer } from "react-toastify";
import { Form, Modal } from "react-bootstrap";
import { FormEvent, FC } from 'react';
//Components 
import Modaltitle from "../modaltitle/Modaltitle";
//Stylist
import styles from './PathModal.module.css';

interface Props {
    title:      string;
    routeName:  string;
    modalShow:  boolean;
    onSubmit:   (e: FormEvent<HTMLFormElement>) => void;
}

const PathModal: FC<Props>              = ({children, routeName, title, onSubmit, modalShow}) => {

    const sizeModal                     = (routeName == 'promotions') ? 'lg':'xl';

    return (
        <Modal
            size                        = {sizeModal}
            backdrop                    = {'static'}
            keyboard                    = {false}
            show                        = {modalShow}
            contentClassName            = {styles.modalContent}
        >
            <Modal.Header style={{ border: "none"}} />
            <ToastContainer autoClose = {10000} />

            <Modal.Body>
                <Form 
                    onSubmit            = {onSubmit}
                >
                    <div className="row d-flex justify-content-center">
                        <Modaltitle titulo  = {title} />
                        {children}
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    ); 
}

export default PathModal;