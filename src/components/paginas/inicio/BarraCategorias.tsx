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
  baños: number;
  setBaños: Dispatch<SetStateAction<number>>;
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
  } = useContext(MapContext);
  const { setTipoPropiedad, propertyTypes, categorias, setCategoria, setBaños, setParking, setHabitaciones} = props;
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

  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null)
  const handleDropDownFocus = (state: boolean) => {
    setOpen(!state);
  };
  const handleClickOutsideDropdown =(e:any)=>{
    if(open && !dropdownRef.current?.contains(e.target as Node)){
      setOpen(false)
    }
  }
  window.addEventListener("click",handleClickOutsideDropdown)

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

  const [selectedRadioBtnBaños, setSelectedRadioBtnBaños] = useState('valueBaños1')
  const isRadioSelectedBaños = (value: string): boolean => selectedRadioBtnBaños === value;
  const handleRadioClickBaños = (e: React.ChangeEvent<HTMLInputElement>): void => { 
    setSelectedRadioBtnBaños(e.currentTarget.value)
  }

  const [selectedRadioBtnParking, setSelectedRadioBtnParking] = useState('valueParking1')
  const isRadioSelectedParking = (value: string): boolean => selectedRadioBtnParking === value;
  const handleRadioClickParking = (e: React.ChangeEvent<HTMLInputElement>): void => { 
    setSelectedRadioBtnParking(e.currentTarget.value)
  }

  return (
    <div className={`text-center`}>
      <div className={styles.btnContainer}>
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

        <div className="dropdown">
        <div className="app-drop-down-container" ref={dropdownRef}>
        <button onClick={(e) => handleDropDownFocus(open)} className={styles.barraItemPropertyType}>Categorías</button>
        {open && (
          <ul className={styles.ulDropdown}>
            <p className={styles.title}>¿Qué tipo de propiedad estás buscando?</p>
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
        )}
        </div>
        </div>

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
                    onChange={(e) => {setBaños(0); handleRadioClickBaños(e);}}  
                    type="radio" 
                    id="11" 
                    value="valueBaños1"
                    checked={isRadioSelectedBaños('valueBaños1')}
                    />
                  <label className={styles.checked} htmlFor="11">0+</label>

                  <input 
                    onChange={(e) => {setBaños(1); handleRadioClickBaños(e);}}  
                    type="radio" 
                    id="22" 
                    value="valueBaños2"
                    checked={isRadioSelectedBaños('valueBaños2')}
                    />
                  <label className={styles.checked} htmlFor="22">1+</label>

                  <input 
                    onChange={(e) => {setBaños(2); handleRadioClickBaños(e);}}
                    type="radio" 
                    id="33" 
                    value="valueBaños3"
                    checked={isRadioSelectedBaños('valueBaños3')}
                    />
                  <label className={styles.checked} htmlFor="33">2+</label>

                  <input 
                    onChange={(e) => {setBaños(3); handleRadioClickBaños(e);}}
                    type="radio" 
                    id="44" 
                    value="valueBaños4"
                    checked={isRadioSelectedBaños('valueBaños4')}
                    />
                  <label className={styles.checked} htmlFor="44">3+</label>

                  <input 
                    onChange={(e) => {setBaños(4); handleRadioClickBaños(e);}}
                    type="radio" 
                    id="55" 
                    value="valueBaños5"
                    checked={isRadioSelectedBaños('valueBaños5')}
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
                type="number" 
                name="minimoPrecio" 
                autoComplete="Off" 
                placeholder="Mínimo"
                onChange={e => setMinimoPrecio(e.target.value)}></input>
                
                <input 
                type="number" 
                name="maximoPrecio" 
                autoComplete="Off" 
                placeholder="Máximo" 
                onChange={e => setMaximoPrecio(e.target.value)}
                ></input>
              </form>
            </li>
            <li>
              <h5 className={styles.TitleFiltros}>Terreno</h5>
              <form className={styles.form}
                onSubmit={e => {
                  e.preventDefault();
                }}>
                <input 
                type="number" 
                name="minimoTerreno" 
                autoComplete="Off" 
                placeholder="Mínimo"
                onChange={e => setMinimoTerreno(e.target.value)}></input>
                
                <input 
                type="number" 
                name="maximoTerreno" 
                autoComplete="Off" 
                placeholder="Máximo" 
                onChange={e => setMaximoTerreno(e.target.value)}
                ></input>
                {/* <button type="submit">Aplicar</button> */}
              </form>
            </li>
            <li>
            <h5 className={styles.TitleFiltros}>Construidos</h5>
              <form className={styles.form}
                onSubmit={e => {
                  e.preventDefault();
                }}>
                <input 
                type="text" 
                name="minimoConstruidos" 
                autoComplete="Off" 
                placeholder="Mínimo" 
                onChange={e => setMinimoConstruidos(e.target.value)}></input>
                
                <input 
                type="text" 
                name="maximoConstruidos" 
                autoComplete="Off" 
                placeholder="Máximo" 
                onChange={e => setMaximoConstruidos(e.target.value)}
                ></input>
                {/* <button type="submit">Aplicar</button> */}
              </form>
            </li>
          </ul>
        )}
        </div>
        </div>

      </div>
    </div>
  );
};

export default BarraCategorias;
