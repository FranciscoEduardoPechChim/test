import { FormEvent, useContext, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Card } from "react-bootstrap";
import Button from "../../ui/button/Button";
import styles from "./Cards.module.css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import "swiper/css";
//Interfaces
import { Inmueble } from "interfaces";

interface Props {
  property:       Inmueble,
  handleFavorite: (input: string, temporal: string, valid: boolean) => void;
  handleShare:    (input: string, temporal: string) => void;
  handleChat:     (temporal: string) => void;
}

const Cards                               = ({property, handleFavorite, handleShare, handleChat}: Props) => {
  return (
      <Card className={`${styles.container} shadow bg-white rounded d-flex justify-content-center`}>
        <Card.Img style={{height: 150}} variant="top" alt="No encontrado" src={(property && (property.imgs.length != 0)) ? property.imgs[0]:'https://res.cloudinary.com/dhcyyvrus/image/upload/v1671216616/images/default_image_q4cpoa.jpg'} />
        <Card.ImgOverlay>
          <div className={styles.textPosition}>Destacado</div>
          <div className={styles.textPositionBottom}>{(property.imgs) ? property.imgs.length:0} Fotos</div>
          <div className={styles.textPositionTop}>
              <a onClick={() => handleFavorite(property._id, (typeof property.usuario == 'string') ? property.usuario:'', (typeof property.isFavorite == 'boolean') ? property.isFavorite:true)}>
                <i className={`${styles.iconHeart} bi bi-heart-fill`} style={{color: (property.isFavorite) ? '#FFC300':'white'}}></i>
              </a>
          </div>
        </Card.ImgOverlay>
        <Card.Body>
          <div className={styles.containerPrice}>
            ${property.precio}
          </div>
          <div className={styles.containerInfo}>
            <div className="row">
              <div className="col-3 d-flex justify-content-start">
                <i className="fas fa-bed"></i>
                <span className={`${styles.spanInfo} mx-1`}>{property.habitaciones}</span>
              </div>
              <div className="col-3 d-flex justify-content-start">
                <i className="fas fa-bath"></i>
                <span className={`${styles.spanInfo} mx-1`}>{property.baños}</span>
              </div>
              <div className="col-3 d-flex justify-content-start">
                <i className="fas fa-car"></i>
                <span className={`${styles.spanInfo} mx-1`}>{property.parking}</span>
              </div>
              <div className="col-3 d-flex justify-content-start">
                <i className="fas fa-tent-arrow-left-right"></i>
                <span className={`${styles.spanInfo} mx-1`}>{property.m2Construidos}</span>
              </div>
            </div>
          </div>
          <div className={styles.containerTitle}>
            {(property.titulo.length < 30) ? property.titulo:property.titulo.substr(0,30)+'...'}
          </div>
          <div>
            {(property.descripcion && (property.descripcion != '')) ? ((property.descripcion.length < 30) ? property.descripcion:property.descripcion.substr(0,30)+'...'):'Sin descripción'}
          </div>
          <div className="row my-1">
            <div className="col-12 d-flex justify-content-end" style={{position: 'absolute'}}>
              <div className="mx-2">
                <a onClick={() => handleShare(property._id, (typeof property.usuario == 'string') ? property.usuario:'')}>
                  <span className={styles.spamContact}>
                    Solicitar Compartir 
                  </span>
                </a>
              </div>
              <div className="mx-2">
                <a onClick={() => handleChat((typeof property.usuario == 'string') ? property.usuario:'')}>
                  <span className={styles.spamChat}>
                    Iniciar Chat
                  </span>
                </a>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
  );
};

export default Cards;
