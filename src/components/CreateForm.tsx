import "date-fns";
import React from "react";
import { Grid, TextField } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from "@material-ui/pickers";

export type InputList = Array<{
    label: string;
    name: string;
    required?: boolean;
    xs?: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    md?: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    calendar?: boolean;
}>;

interface Props {
    register: any
    inputList: InputList;
}

export const CreateForm = ({ register, inputList }: Props) => {
    return (
        <>
            {inputList.map((entry, index) => {
                return entry.calendar ? (
                    <Grid
                        item
                        key={`config-form-${index}`}
                        xs={entry.xs}
                        md={entry.md}
                    >
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                            fullWidth
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                inputVariant="outlined"
                                label={entry.label}
                                value={new Date()}
                                onChange={(e) => console.log(e)}
                                KeyboardButtonProps={{
                                    "aria-label": "change date",
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                ) : (
                    <Grid
                        item
                        key={`config-form-${index}`}
                        xs={entry.xs}
                        md={entry.md}
                    >
                        <TextField
                            fullWidth
                            autoComplete="nope"
                            required={
                                entry.required === undefined
                                    ? true
                                    : entry.required
                            }
                            label={entry.label}
                            name={entry.name}
                            variant="outlined"
                            inputRef={register({
                                required: entry.required
                            })}
                        />
                    </Grid>
                );
            })}
        </>
    );
};
