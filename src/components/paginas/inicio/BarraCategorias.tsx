import React, { Dispatch, SetStateAction, useContext, useState, useRef } from "react";
import { Categoria } from "interfaces/InmueblesInterface";
import { TipoPropiedad } from "interfaces/PropertyType";
import styles from "./BarraCategoria.module.css";
import { MapContext } from "context/map/MapContext";

interface Props {
  setTipoPropiedad: Dispatch<SetStateAction<string>>;
  propertyTypes: TipoPropiedad[];
  setCategoria: Dispatch<SetStateAction<string>>;
  categorias: Categoria[];
  banos: number;
  setBanos: Dispatch<SetStateAction<number>>;
  parking: number;
  setParking: Dispatch<SetStateAction<number>>;
  habitaciones: number;
  setHabitaciones: Dispatch<SetStateAction<number>>;
}

const BarraCategorias = (props: Props) => {
  const {
    setMinimoTerreno, 
    setMaximoTerreno,
    setMinimoConstruidos,
    setMaximoConstruidos,
    setMinimoPrecio,
    setMaximoPrecio,
    setIdentification,
    minimoPrecio,
    maximoPrecio,
    minimoTerreno, 
    maximoTerreno,
    minimoConstruidos,
    maximoConstruidos,
    identification
  } = useContext(MapContext);
  const { setTipoPropiedad, propertyTypes, categorias, setCategoria, setBanos, setParking, setHabitaciones} = props;
  const { categoria, tipoPropiedad } = useContext(MapContext);
  const [selectedPro, setSelected] = useState(tipoPropiedad);
  const [selectedCat, setselectedCat] = useState(categoria);


  const seleccionarCategoria = (id: string) => {
    setCategoria(id);
    setselectedCat(id);
  };

  const seleccionarTipoPropiedad = (id: string) => {
    setTipoPropiedad(id);
    setSelected(id);
  };

  // 2
  const [open2, setOpen2] = useState<boolean>(false);
  const dropdownRef2 = useRef<HTMLDivElement>(null)
  const handleDropDownFocus2 = (state2: boolean) => {
    setOpen2(!state2);
  };
  const handleClickOutsideDropdown2 =(e:any)=>{
    if(open2 && !dropdownRef2.current?.contains(e.target as Node)){
      setOpen2(false)
    }
  }
  window.addEventListener("click",handleClickOutsideDropdown2)

  const [selectedRadioBtn, setSelectedRadioBtn] = useState('value1')
  const isRadioSelected = (value: string): boolean => selectedRadioBtn === value;
  const handleRadioClick = (e: React.ChangeEvent<HTMLInputElement>): void => { 
    setSelectedRadioBtn(e.currentTarget.value)
  }

  const [selectedRadioBtnBanos, setSelectedRadioBtnBanos] = useState('valueBanos1')
  const isRadioSelectedBanos = (value: string): boolean => selectedRadioBtnBanos === value;
  const handleRadioClickBanos = (e: React.ChangeEvent<HTMLInputElement>): void => { 
    setSelectedRadioBtnBanos(e.currentTarget.value)
  }

  const [selectedRadioBtnParking, setSelectedRadioBtnParking] = useState('valueParking1')
  const isRadioSelectedParking = (value: string): boolean => selectedRadioBtnParking === value;
  const handleRadioClickParking = (e: React.ChangeEvent<HTMLInputElement>): void => { 
    setSelectedRadioBtnParking(e.currentTarget.value)
  }

  const [selectedRadioBtnConjunto, setSelectedRadioBtnConjunto] = useState('valueConjunto1')
  const isRadioSelectedConjunto = (value: string): boolean => selectedRadioBtnConjunto === value;
  const handleRadioClickConjunto = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedRadioBtnConjunto(e.currentTarget.value)
  }

  return (
    <div className={styles.textCenter}>
      <div className={styles.btnContainer}>
          <ul className={styles.ulDropdown}>
            {categorias?.map((categoria) => (
          <span
            className={`${selectedCat === categoria._id
              ? styles.barraItemCategorySelected2 
              : styles.barraItemCategory2
              } mx-2 pointer`}
            onClick={() => {
              seleccionarCategoria(categoria._id);
            }}
            key={categoria._id}
          >
            {categoria.nombre}
          </span>
        ))}
        {propertyTypes.map((propertyType) => (
          <li
            className={`${selectedPro === propertyType._id
              ? styles.barraItemPropertyTypeSelected2
              : styles.barraItemPropertyType2
              } mx-2 pointer`}
            onClick={() => seleccionarTipoPropiedad(propertyType._id)}
            key={propertyType._id}
          >
            {propertyType.nombre}
          </li>  
        ))}
        </ul>


        <div className={styles.flexrow}>
        {categorias?.map((categoria) => (
          <span
            className={`${selectedCat === categoria._id
              ? styles.barraItemCategorySelected 
              : styles.barraItemCategory
              } mx-2 pointer`}
            onClick={() => {
              seleccionarCategoria(categoria._id);
            }}
            key={categoria._id}
          >
            {categoria.nombre}
          </span>
        ))}
        <div className={styles.dropdown}>
        <div className="app-drop-down-container" ref={dropdownRef2}>
        <button onClick={(e) => handleDropDownFocus2(open2)} className={styles.barraItemPropertyType}>Filtros</button>
        {open2 && (
          <ul className={styles.ulDropdown2}>
            <li>
              <h4 className={styles.TitleFiltros}>Recamara(s)</h4>
              <div className={styles.buttonContainer}>
                <form action="">
                  <input 
                    onChange={(e) => {setHabitaciones(0); handleRadioClick(e);}}  
                    type="radio" 
                    id="1" 
                    value="value1"
                    checked={isRadioSelected('value1')}
                    />
                  <label className={styles.checked} htmlFor="1">0+</label>

                  <input 
                    onChange={(e) => {setHabitaciones(1); handleRadioClick(e);}}  
                    type="radio" 
                    id="2" 
                    value="value2"
                    checked={isRadioSelected('value2')}
                    />
                  <label className={styles.checked} htmlFor="2">1+</label>

                  <input 
                    onChange={(e) => {setHabitaciones(2); handleRadioClick(e);}}
                    type="radio" 
                    id="3" 
                    value="value3"
                    checked={isRadioSelected('value3')}
                    />
                  <label className={styles.checked} htmlFor="3">2+</label>

                  <input 
                    onChange={(e) => {setHabitaciones(3); handleRadioClick(e);}}
                    type="radio" 
                    id="4" 
                    value="value4"
                    checked={isRadioSelected('value4')}
                    />
                  <label className={styles.checked} htmlFor="4">3+</label>

                  <input 
                    onChange={(e) => {setHabitaciones(4); handleRadioClick(e);}}
                    type="radio" 
                    id="5" 
                    value="value5"
                    checked={isRadioSelected('value5')}
                    />
                  <label className={styles.checked} htmlFor="5">4+</label>
                </form>
              </div>
            </li>
            <li>
              <h4 className={styles.TitleFiltros}>Baños</h4>
              <div className={styles.buttonContainer}>
                <form action="">
                  <input 
                    onChange={(e) => {setBanos(0); handleRadioClickBanos(e);}}  
                    type="radio" 
                    id="11" 
                    value="valueBanos1"
                    checked={isRadioSelectedBanos('valueBanos1')}
                    />
                  <label className={styles.checked} htmlFor="11">0+</label>

                  <input 
                    onChange={(e) => {setBanos(1); handleRadioClickBanos(e);}}  
                    type="radio" 
                    id="22" 
                    value="valueBanos2"
                    checked={isRadioSelectedBanos('valueBanos2')}
                    />
                  <label className={styles.checked} htmlFor="22">1+</label>

                  <input 
                    onChange={(e) => {setBanos(2); handleRadioClickBanos(e);}}
                    type="radio" 
                    id="33" 
                    value="valueBanos3"
                    checked={isRadioSelectedBanos('valueBanos3')}
                    />
                  <label className={styles.checked} htmlFor="33">2+</label>

                  <input 
                    onChange={(e) => {setBanos(3); handleRadioClickBanos(e);}}
                    type="radio" 
                    id="44" 
                    value="valueBanos4"
                    checked={isRadioSelectedBanos('valueBanos4')}
                    />
                  <label className={styles.checked} htmlFor="44">3+</label>

                  <input 
                    onChange={(e) => {setBanos(4); handleRadioClickBanos(e);}}
                    type="radio" 
                    id="55" 
                    value="valueBanos5"
                    checked={isRadioSelectedBanos('valueBanos5')}
                    />
                  <label className={styles.checked} htmlFor="55">4+</label>
                </form>
              </div>
            </li>
            <li>
              <h4 className={styles.TitleFiltros}>Garage</h4>
              <div className={styles.buttonContainer}>
              <form action="">
                  <input 
                    onChange={(e) => {setParking(0); handleRadioClickParking(e);}}  
                    type="radio" 
                    id="111" 
                    value="valueParking1"
                    checked={isRadioSelectedParking('valueParking1')}
                    />
                  <label className={styles.checked} htmlFor="111">0+</label>

                  <input 
                    onChange={(e) => {setParking(1); handleRadioClickParking(e);}}  
                    type="radio" 
                    id="222" 
                    value="valueParking2"
                    checked={isRadioSelectedParking('valueParking2')}
                    />
                  <label className={styles.checked} htmlFor="222">1+</label>

                  <input 
                    onChange={(e) => {setParking(2); handleRadioClickParking(e);}}
                    type="radio" 
                    id="333" 
                    value="valueParking3"
                    checked={isRadioSelectedParking('valueParking3')}
                    />
                  <label className={styles.checked} htmlFor="333">2+</label>

                  <input 
                    onChange={(e) => {setParking(3); handleRadioClickParking(e);}}
                    type="radio" 
                    id="444" 
                    value="valueParking4"
                    checked={isRadioSelectedParking('valueParking4')}
                    />
                  <label className={styles.checked} htmlFor="444">3+</label>

                  <input 
                    onChange={(e) => {setParking(4); handleRadioClickParking(e);}}
                    type="radio" 
                    id="555" 
                    value="valueParking5"
                    checked={isRadioSelectedParking('valueParking5')}
                    />
                  <label className={styles.checked} htmlFor="555">4+</label>
                </form>
              </div>
            </li>
            <li>
              <h5 className={styles.TitleFiltros}>Precio</h5>
              <form className={styles.form}
                onSubmit={e => {
                  e.preventDefault();
                }}>
                <input 
                  type          = "number" 
                  name          = "minimoPrecio" 
                  autoComplete  = "Off" 
                  placeholder   = "Mínimo"
                  min           = {0}
                  value         = {minimoPrecio}
                  onChange      = {(e:any) =>  setMinimoPrecio((e.target.value != '') ? e.target.value:'0')}
                />
                
                <input 
                  type          = "number" 
                  name          = "maximoPrecio" 
                  autoComplete  = "Off" 
                  placeholder   = "Máximo" 
                  min           = {0}
                  value         = {maximoPrecio}
                  onChange      = {(e:any) => setMaximoPrecio((e.target.value != '' && e.target.value != '0') ? e.target.value:'10000000')}
                />
              </form>
            </li>
            <li>
              <h5 className={styles.TitleFiltros}>Terreno</h5>
              <form className={styles.form}
                onSubmit={e => {
                  e.preventDefault();
                }}>
                <input 
                  type          = "number" 
                  name          = "minimoTerreno" 
                  autoComplete  = "Off" 
                  placeholder   = "Mínimo"
                  min           = {0}
                  value         = {minimoTerreno}
                  onChange      = {(e:any) => setMinimoTerreno((e.target.value != '') ? e.target.value:'0')}
                />
                
                <input 
                  type          = "number" 
                  name          = "maximoTerreno" 
                  autoComplete  = "Off" 
                  placeholder   = "Máximo" 
                  min           = {0}
                  value         = {maximoTerreno}
                  onChange      = {(e:any) => setMaximoTerreno((e.target.value != '' && e.target.value != '0') ? e.target.value:'10000')}
                />
  
              </form>
            </li>
            <li>
              <h4 className={styles.TitleFiltros}>Conjunto</h4>
              <div className={styles.buttonContainer}>
              <form action="">
                  <input 
                    onChange={(e) => {handleRadioClickConjunto(e);}}  
                    type="radio" 
                    id="1111" 
                    value="valueConjunto1"
                    checked={isRadioSelectedConjunto('valueConjunto1')}
                    />
                  <label className={styles.checked2} htmlFor="1111">Todos</label>

                  <input 
                    onChange={(e) => {handleRadioClickConjunto(e);}}  
                    type="radio" 
                    id="2222" 
                    value="valueConjunto2"
                    checked={isRadioSelectedConjunto('valueConjunto2')}
                    />
                  <label className={styles.checked2} htmlFor="2222">Desarrollo</label>

                  <input 
                    onChange={(e) => {handleRadioClickConjunto(e);}}
                    type="radio" 
                    id="3333" 
                    value="valueConjunto3"
                    checked={isRadioSelectedConjunto('valueConjunto3')}
                    />
                  <label className={styles.checked2} htmlFor="3333">Privada</label>

                  <input 
                    onChange={(e) => {handleRadioClickConjunto(e);}}
                    type="radio" 
                    id="4444" 
                    value="valueConjunto4"
                    checked={isRadioSelectedConjunto('valueConjunto4')}
                    />
                  <label className={styles.checked2} htmlFor="4444">Condominios</label>

                  <input 
                    onChange={(e) => {handleRadioClickConjunto(e);}}
                    type="radio" 
                    id="5555" 
                    value="valueConjunto5"
                    checked={isRadioSelectedConjunto('valueConjunto5')}
                    />
                  <label className={styles.checked2} htmlFor="5555">Club de golf</label>

                  <input 
                    onChange={(e) => {handleRadioClickConjunto(e);}}
                    type="radio" 
                    id="6666" 
                    value="valueConjunto6"
                    checked={isRadioSelectedConjunto('valueConjunto6')}
                    />
                  <label className={styles.checked2} htmlFor="6666">Fraccionamiento</label>

                  <input 
                    onChange={(e) => {handleRadioClickConjunto(e);}}
                    type="radio" 
                    id="7777" 
                    value="valueConjunto7"
                    checked={isRadioSelectedConjunto('valueConjunto7')}
                    />
                  <label className={styles.checked2} htmlFor="7777">Residencial</label>

                  <input 
                    onChange={(e) => {handleRadioClickConjunto(e);}}
                    type="radio"
                    id="8888" 
                    value="valueConjunto8"
                    checked={isRadioSelectedConjunto('valueConjunto8')}
                    />
                  <label className={styles.checked2} htmlFor="8888">Country club</label>

                </form>
              </div>
            </li>
            <li>
            <h5 className={styles.TitleFiltros}>Construidos</h5>
              <form className={styles.form}
                onSubmit={e => {
                  e.preventDefault();
                }}>
                <input 
                  type          = "number" 
                  name          = "minimoConstruidos" 
                  autoComplete  = "Off" 
                  placeholder   = "Mínimo" 
                  min           = {0}
                  value         = {minimoConstruidos}
                  onChange      = {(e:any) => setMinimoConstruidos((e.target.value != '') ? e.target.value:'0')}
                />
                
                <input 
                  type          = "number" 
                  name          = "maximoConstruidos" 
                  autoComplete  = "Off" 
                  placeholder   = "Máximo" 
                  min           = {0}
                  value         = {maximoConstruidos}
                  onChange      = {(e:any) => setMaximoConstruidos((e.target.value != '' && e.target.value != '0') ? e.target.value:'10000')}
                />
                {/* <button type="submit">Aplicar</button> */}
              </form>
            </li>
            <li>
              <h5 className={styles.TitleFiltros}>Identificador</h5>
              <form className={styles.form}
                onSubmit={e => {
                  e.preventDefault(); 
                }}>
                  <div className="row">
                    <div className="col-6 mx-2">
                      <input 
                        type          = "text" 
                        name          = "alias" 
                        autoComplete  = "Off" 
                        placeholder   = "House One" 
                        value         = {identification}
                        onChange      = {(e:any) => setIdentification((e.target.value != '') ? e.target.value:'')} 
                      />
                    </div>
                  </div>
              </form>
            </li>
          </ul>
        )}
        </div>
        </div>
        </div>

      </div>
    </div>
  );
};

export default BarraCategorias;
