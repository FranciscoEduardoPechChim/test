import { useEffect, useState } from "react";
import { Categoria } from "../interfaces/InmueblesInterface";
import { TipoPropiedad } from "../interfaces/PropertyType";
import { production } from '../credentials/credentials';

export const useCategories = () => {
  const [cargando, setCargando] = useState(true);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const obtenerCategorias = async () => {
    const resp = await fetch(`${production}/categorias`);
    const data = await resp.json();

    setCategorias(data.categorias);
    setCargando(false);
  };
  useEffect(() => {
    obtenerCategorias();
  }, []);

  return { categorias, cargando };
};

export const useTipoPropiedad = () => {
  const [propertyTypes, setPropertyTypes] = useState<TipoPropiedad[]>([]);
  const [loading, setLoading] = useState(true);

  const obtenerTipoPropiedad = async () => {
    const res = await fetch(`${production}/tipo-de-propiedad`);
    const data = await res.json();

    setPropertyTypes(data.tipoPropiedad);
    setLoading(false);
  };

  useEffect(() => {
    obtenerTipoPropiedad();
  }, []);

  return { propertyTypes, loading };
};
