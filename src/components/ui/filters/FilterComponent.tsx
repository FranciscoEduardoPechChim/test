import style from './FilterComponent.module.css';

const FilterComponent = ({ filterText, onFilter }:any) => (
    <div className='mt-1 mb-3'>
        <input
            id          = "search"
            className   = {style.input}
            type        = "text"
            placeholder = "Buscar..."
            aria-label  = "Buscar"
            value       = {filterText}
            onChange    = {onFilter}
        />
    </div>
);

export default FilterComponent;