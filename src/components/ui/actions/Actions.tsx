//React
import { useState } from "react";
//Material UI
import Select, { SelectChangeEvent } from '@mui/material/Select';
import VisibilityIcon from '@material-ui/icons/Visibility';
import RestoreIcon from '@material-ui/icons/Restore';
import FormControl from '@mui/material/FormControl';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

interface props {
    actions:        any;
    id:             string;
    selectAction:   string;
    selectId:       string;
    handleChange:   (event: SelectChangeEvent, id: string) => void;
}

const ActionComponent           = ({ actions, id, selectAction, selectId, handleChange }:props) => {
    return (
    <div className='my-1'>
        <Box>
            <FormControl fullWidth size="small">
                <Select
                    sx          = {{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                    labelId     = "demo-simple-select-label"
                    id          = "demo-simple-select"
                    value       = {(selectId == id) ? selectAction: ''}
                    onChange    =  {(event: SelectChangeEvent) => handleChange(event, id)}
                >
                    {actions && actions.map((action:string, index: any) => {
                        if(action == 'show') {
                            return (<MenuItem key={index} value={action}><VisibilityIcon /> <span className='mx-1'>Ver</span></MenuItem>);
                        }
                        if(action == 'edit') {
                            return (<MenuItem key={index} value={action}><EditIcon /> <span className='mx-1'>Editar</span> </MenuItem>);
                        }
                        if(action == 'delete') {
                            return (<MenuItem key={index} value={action}><DeleteIcon /> <span className='mx-1'>Eliminar</span></MenuItem>);
                        }
                        if(action == 'restore') {
                            return (<MenuItem key={index} value={action}><RestoreIcon /> <span className='mx-1'>Restaurar</span></MenuItem>);
                        }
                    })}
                </Select>
            </FormControl>
        </Box>
    </div>);
};

export default ActionComponent;
