import { reset } from "linkifyjs";
import { ChangeEvent, useState } from "react";

export const useForm  = <T extends Object>(initialState: T) => {
  const [formulario, setFormulario] = useState(initialState);
  const [length, setLength]         = useState(0);

  const handleChange  = ({
    target,
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = target;

    if(name == 'description') {
      setLength(value.length);
    }

    setFormulario({ ...formulario, [name]: value });
  };

  const reset         = () => setFormulario(initialState);
  
  return { formulario, handleChange, reset, setFormulario, length, setLength};
};
