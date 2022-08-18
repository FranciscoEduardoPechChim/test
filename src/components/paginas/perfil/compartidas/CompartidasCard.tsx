import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { Col, Container, Pagination, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { AuthContext } from "../../../../context/auth/AuthContext";
import { useCompartidas } from "../../../../hooks/useCompartidas";
import styles from "./Compartidas.module.css";
import { InmuebleContext } from "../../../../context/inmuebles/InmuebleContext";
import Loading from "../../..//ui/loading/Loading";
import { fetchAceptarRechazarSolicitud } from "../../../../helpers";
import { production } from "../../../../credentials";
import CopyToClipboard from "react-copy-to-clipboard";

const CompartidasCard = () => {
  const { auth } = useContext(AuthContext);
  const { estado, misCompUser } = useContext(InmuebleContext);
  const [totall, setTotall] = useState(0);
  const router = useRouter();
  const { total, cargando, compartidas, setCompartidas } = useCompartidas(
    misCompUser,
    estado,
    totall
  );

  const compartir = () => toast.success(`Se ha copiado al portapapeles`);

  const goToProperty = (slug: string) => router.push(`/propiedades/${slug}`);

  const aprobarSolicitud = async (
    id: string,
    titulo: string,
    img: string,
    correo: string
  ) => {
    const aprobacion = {
      estado: "Aprobado",
    };

    const res = await fetchAceptarRechazarSolicitud(
      `solicitud/aceptar/${id}`,
      aprobacion
    );

    const body = {
      nombre: auth.nombre,
      apellido: auth.apellido,
      titulo,
      img,
      correo,
    };

    if (res.ok) {
      await fetch(`${production}/correos/solicitud-aprobada`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const solicitudAprobada: any = compartidas?.map((solicitud) => {
        if (solicitud._id === id) {
          return { ...solicitud, estado: "Aprobado" };
        }
        return solicitud;
      });
      setCompartidas(solicitudAprobada);
      toast.success(res.msg);
    }
  };

  const rechazarSolicitud = async (
    id: string,
    titulo: string,
    img: string,
    correo: string
  ) => {
    const rechazo = {
      estado: "Rechazado",
    };

    const body = {
      nombre: auth.nombre,
      apellido: auth.apellido,
      titulo,
      img,
      correo,
    };

    const res = await fetchAceptarRechazarSolicitud(
      `solicitud/rechazar/${id}`,
      rechazo
    );

    if (res.ok) {
      await fetch(`${production}/correos/solicitud-rechazada`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const solicitudRechazada: any = compartidas?.map((solicitud) => {
        if (solicitud._id === id) {
          return { ...solicitud, estado: "Rechazado" };
        }
        return solicitud;
      });
      setCompartidas(solicitudRechazada);
      toast.success(res.msg);
    }
  };

  const handlePrevPage = () => {
    if (totall === 0) {
      return;
    } else {
      setTotall(totall - 15);
    }
  };
  const handleNextPage = () => {
    if (totall < total - 15) {
      setTotall(totall + 15);
    } else {
      return;
    }
  };

  return (
    <Container>
      {compartidas?.length === 0 ? (
        <div className={`${styles.titulo} text-center`}>
          No tienes propiedades compartidas
        </div>
      ) : (
        <Row>
          {cargando ? (
            <Loading />
          ) : (
            <>
              {compartidas?.map((compartida) => (
                <Col
                  key={compartida._id}
                  xs={6}
                  md={4}
                  lg={4}
                  xl={3}
                  className="py-3 text-center"
                >
                  <div className={`${styles.customCard} card`}>
                    {compartida.estado === "Aprobado" ? (
                      <img
                        className={styles.iconoF}
                        src="/images/icons/properties-icons/aprobado.png"
                        alt=""
                      />
                    ) : null}

                    {compartida.estado === "Pendiente" ? (
                      <img
                        className={styles.iconoF}
                        src="/images/icons/properties-icons/pendiente.png"
                        alt=""
                      />
                    ) : null}
                    {compartida.estado === "Rechazado" ? (
                      <img
                        className={styles.iconoF}
                        src="/images/icons/properties-icons/rechazado.png"
                        alt=""
                      />
                    ) : null}

                    <div>
                      <div
                        onClick={() => goToProperty(compartida.inmueble.slug)}
                        className={`${styles.imgContainer} pointer`}
                      >
                        <div
                          className={styles.cardImg}
                          style={{
                            backgroundImage: `url('${compartida.inmueble.imgs[0]}')`,
                          }}
                        />
                      </div>
                      <div className={styles.tituloContainer}>
                        <div className={`${styles.proContent} my-2 mx-1`}>
                          {compartida.inmueble.titulo}
                        </div>
                      </div>
                      <div>
                        {auth.uid === compartida.propietario._id ? (
                          <>
                            {compartida.estado === "Aprobado" ? (
                              <div className={`${styles.bottomCard}`}>
                                <span>
                                  Has compartido este inmueble con{" "}
                                  <b>
                                    {compartida.usuario.nombre}{" "}
                                    {compartida.usuario.apellido}
                                  </b>
                                </span>
                              </div>
                            ) : compartida.estado === "Rechazado" ? (
                              <div className={`${styles.bottomCard}`}>
                                <span>
                                  Has rechazado la solicitud de{" "}
                                  <b>
                                    {compartida.usuario.nombre}{" "}
                                    {compartida.usuario.apellido}
                                  </b>
                                </span>
                              </div>
                            ) : compartida.estado === "Pendiente" ? (
                              <div className={`${styles.bottomCard}`}>
                                <b>
                                  {compartida.usuario.nombre}{" "}
                                  {compartida.usuario.apellido}{" "}
                                </b>{" "}
                                quiere que le compartas este inmueble
                                <div className="d-flex justify-content-center mt-2">
                                  <button
                                    onClick={() =>
                                      aprobarSolicitud(
                                        compartida._id,
                                        compartida.inmueble.titulo,
                                        compartida.inmueble.imgs[0]
                                          ? compartida.inmueble.imgs[0]
                                          : "",
                                        compartida.usuario.correo
                                      )
                                    }
                                    className={`${styles.btnApprove} me-2`}
                                  >
                                    <i
                                      className={`${styles.iconNoti} bi bi-hand-thumbs-up`}
                                    ></i>
                                  </button>
                                  <button
                                    onClick={() =>
                                      rechazarSolicitud(
                                        compartida._id,
                                        compartida.inmueble.titulo,
                                        compartida.inmueble.imgs[0]
                                          ? compartida.inmueble.imgs[0]
                                          : "",
                                        compartida.usuario.correo
                                      )
                                    }
                                    className={`${styles.btnReject} me-2`}
                                  >
                                    <i
                                      className={`${styles.iconNoti} bi bi-hand-thumbs-down`}
                                    ></i>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              "Error. Nunca debe de llegar aquí"
                            )}
                          </>
                        ) : (
                          <div className={`${styles.bottomCard}`}>
                            <span>
                              {compartida.estado === "Aprobado" ? (
                                <>
                                  <b>
                                    {compartida.propietario.nombre}{" "}
                                    {compartida.propietario.apellido}
                                  </b>
                                  {" "}ha compartido esta propiedad contigo.{" "}

                                  <CopyToClipboard
                                    onCopy={compartir}
                                    text={`https://red1a1.com/app/propiedades/${compartida.inmueble.slug}`}
                                  >
                                    <button className={`${styles.btnShare}`} />
                                  </CopyToClipboard>
                                </>
                              ) : compartida.estado === "Rechazado" ? (
                                <>
                                  <b>
                                    {compartida.propietario.nombre}{" "}
                                    {compartida.propietario.apellido}
                                  </b>
                                  {" "}ha rechazado tu solicitud.{" "}
                                </>
                              ) : compartida.estado === "Pendiente" ? (
                                <>
                                  <b>
                                    {compartida.propietario.nombre}{" "}
                                    {compartida.propietario.apellido}
                                  </b>
                                  {" "}tiene pendiente tu solicitud{" "}
                                </>
                              ) : (
                                "Error. Nunca debe llegar aquí"
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </>
          )}
          {total > 20 ? (
            <div className="d-flex justify-content-center">
              <Pagination>
                <Pagination.Prev onClick={handlePrevPage} />
                <Pagination.Next onClick={handleNextPage} />
              </Pagination>
            </div>
          ) : null}
        </Row>
      )}
    </Container>
  );
};

export default CompartidasCard;
