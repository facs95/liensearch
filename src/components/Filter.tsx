import React from 'react';
import { TextField, MenuItem } from '@material-ui/core';

interface Props {
    options: string[]
    selected: string
    setter: React.Dispatch<React.SetStateAction<string>>
    label: string
}

export const Filter = ({options, selected, setter, label}: Props) => {

    return (
        <TextField
            label={label}
            select
            value={selected}
            variant="outlined"
            fullWidth
            size="small"
            onChange={(e) => setter(e.target.value as string)}
        >
            <MenuItem value="">All</MenuItem>
            {options.map((option, index) => (
                <MenuItem key={`${index}-${option}`} value={option}>
                    {option}
                </MenuItem>
            ))}
        </TextField>
    )
}