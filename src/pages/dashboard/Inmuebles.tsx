import { useRouter } from "next/router";
import DashboardLayout from "components/layout/Dashboard";
import SEO from "components/seo/SEO";
import { AdminRoute } from "hooks/useAdminRoute";
import { Form } from "react-bootstrap";
import styleRef from "components/paginas/dashboard/Referencias.module.css";
// import styles from './dashboard.module.css'



const Inmuebles = () => {
    const router = useRouter();


    return (
        <>
            <SEO titulo="inmuebles" url={router.asPath} />
            <DashboardLayout titulo="INMUEBLES">
                {/* <section className="my-5">
                    <div className="container">
                        <div className={`${styles.filtros}`}>
                            <div className="row">
                                <div className="col-2">
                                    <div className="row">
                                        <div className="col-2 text-center">
                                            <div className={styles.backprofile}>
                                                <img src="" alt="..." />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-10">
                                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iusto quod rerum maiores voluptates incidunt tenetur ipsa delectus placeat cupiditate sunt ullam consectetur in aliquid, autem velit sint ratione, facere est dicta, et hic? Id obcaecati ut voluptatum voluptas, corporis cumque quos aliquam officiis. Unde et dolore repellendus quasi nobis earum?
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}


                <section className="my-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-2 mb-3">
                                <label><b>Desde:</b></label> <br />
                                <input type="date" className="Dpicker" />
                            </div>
                            <div className="col-2 mb-3">
                                <label><b>Hasta:</b></label> <br />
                                <input type="date" className="Dpicker" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12 col-md-4 col-lg-3 col-xl-3 mb-sm-2 mb-md-1 mb-2">
                                <Form.Control type="text" placeholder="Buscar . . . " />
                            </div>
                            <div className="col-sm-12 col-md-4 col-lg-3 col-xl-3 mb-sm-2 mb-md-1 mb-2">
                                <Form.Select aria-label="Default select example">
                                    <option>Ubicación</option>
                                    <option value="1">Cancún, Q.Roo, MX</option>
                                    <option value="2">Merida, YUC, MX</option>
                                    <option value="3">CDMX, Mexico, MX</option>
                                    <option value="3">Tijuana, Baja California, MX</option>
                                    <option value="5">etc...</option>
                                </Form.Select>
                            </div>
                            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-2 mb-sm-2 mb-md-1 mb-2">
                                <Form.Select aria-label="Default select example">
                                    <option>Tipo</option>
                                    <option value="1">Venta</option>
                                    <option value="2">Renta</option>
                                </Form.Select>
                            </div>
                            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-2 mb-sm-2 mb-md-1 mb-2">
                                <Form.Select aria-label="Default select example">
                                    <option>Categoria</option>
                                    <option value="1">Casas</option>
                                    <option value="2">Departamentos</option>
                                    <option value="3">Bodegas</option>
                                    <option value="4">Terrenos</option>
                                    <option value="5">Edificios</option>
                                    <option value="6">Locales</option>
                                    <option value="7">Oficinas</option>
                                    <option value="8">Desarrollos</option>
                                </Form.Select>
                            </div>
                            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-2 mb-sm-2 mb-md-1 mb-2">
                                <Form.Select aria-label="Default select example">
                                    <option>Estatus</option>
                                    <option value="1">Activo</option>
                                    <option value="2">Pausado</option>
                                </Form.Select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 my-2">
                                <div className={`${styleRef.tablaRef} table-responsive`}>
                                    <div className={styleRef.headerRef}>
                                        Inmuebles publicados : 728
                                    </div>
                                    <table className="w-100">
                                        <tr className={styleRef.rowT}>
                                            {/* <td className={styleRef.headersT}>Id</td> */}
                                            <td className={styleRef.headersT}>id</td>
                                            <td className={styleRef.headersT}>Titulo</td>
                                            <td className={styleRef.headersT}>Tipo</td>
                                            <td className={styleRef.headersT}>Categoria</td>
                                            <td className={styleRef.headersT}>Precio</td>
                                            <td className={styleRef.headersT}>Ubicación</td>
                                            <td className={styleRef.headersT}></td>
                                        </tr>

                                        <tr className={styleRef.rowT}>
                                            {/* <td className={styleRef.contentT}>
                                                as65d6asd56asd1a65d
                                            </td> */}
                                            <td className={styleRef.contentT}>
                                                a65sd165asd1
                                            </td>
                                            <td className={styleRef.contentT}>
                                                Casa en venta, Andalucia Cancún
                                            </td>
                                            <td className={styleRef.contentT}>
                                                Venta
                                            </td>
                                            <td className={styleRef.contentT}>
                                                Casas
                                            </td>
                                            <td className={styleRef.contentT}>
                                                $ 12,500,000.00 MXN
                                            </td>
                                            <td className={styleRef.contentT}>
                                                Cancun, Q.Roo, MX
                                            </td>
                                            <td className={styleRef.contentT}>
                                                <button
                                                    className={`${styleRef.btnT1} px-2 mx-1`}
                                                >
                                                    <i className="bi bi-eye" />
                                                </button>
                                            </td>
                                        </tr>


                                    </table>
                                    {/* {referencias.length === 0 ? (
                                        <h2 className="text-center py-5">
                                            Aún no hay referencias
                                        </h2>
                                    ) : null} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </DashboardLayout>
        </>
    )
}

export default AdminRoute(Inmuebles)