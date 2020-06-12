import React from 'react';
import { Grid, TextField } from '@material-ui/core';
import { FieldElement } from 'react-hook-form';

export type InputList = Array<{
    label: string, 
    name: string,
    required?: boolean,
    xs?: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
    md?: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
}>

interface Props {
    register: {
        <Element extends FieldElement<any> = FieldElement<any>>(): (ref: Element | null) => void;
    },
    inputList: InputList
}

export const CreateForm = ({ register, inputList}: Props) => {

    return (
        <>
            {inputList.map((entry, index) => (
                <Grid item key={`config-form-${index}`} xs={entry.xs} md={entry.md}>
                    <TextField fullWidth 
                        autoComplete='nope'
                        required={entry.required === undefined ? true : entry.required} 
                        label={entry.label} 
                        name={entry.name}
                        variant="outlined"
                        inputRef={register} />
                </Grid>
            ))}
        </>
    )
}