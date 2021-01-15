import React from "react";
import {
    TextField,
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from "@material-ui/core";

interface Props<T extends object> {
    isNotRequired?: boolean;
    isNumber?: boolean;
    label: string;
    name: keyof T;
    title?: string
    value: string | number | boolean;
    setter: React.Dispatch<React.SetStateAction<T>>;
    isBoolean?: boolean;
}

export function InputGenerator<T extends object>({
    isNotRequired,
    name,
    isNumber,
    title,
    label,
    value,
    setter,
    isBoolean,
}: Props<T>) {
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const val = isNumber ? parseInt(e.target.value) : e.target.value;
        setter((current) => {
            let n = { ...current };
            n[name] = (val as unknown) as T[keyof T];
            return n;
        });
    };

    return isBoolean ? (
        <FormControl>
            <FormGroup>
                <FormControlLabel
                    label={label}
                    control={
                        <Checkbox
                            checked={value as boolean}
                            onChange={() =>
                                setter((c) => {
                                    let n = { ...c };
                                    n[name] = (!c[
                                        name
                                    ] as unknown) as T[keyof T];
                                    return n;
                                })
                            }
                        />
                    }
                />
            </FormGroup>
        </FormControl>
    ) : (
        <TextField
            name={title}
            fullWidth
            autoComplete="nope"
            required={!isNotRequired}
            onChange={handleChange}
            value={value}
            label={label}
            variant="outlined"
        />
    );
}
