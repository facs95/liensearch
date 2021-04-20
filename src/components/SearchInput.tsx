import React from "react";
import { TextField, Grid } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

interface Props {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}

export const SearchInput = ({ value, setValue }: Props) => {
    return (
        <Grid item container spacing={1} alignItems="flex-end">
            <Grid item>
                <SearchIcon color="disabled" />
            </Grid>
            <Grid item xs={9}>
                <TextField
                    InputProps={{ disableUnderline: true }}
                    data-lpignore="true"
                    fullWidth
                    autoComplete="off"
                    {...{ value }}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Search by address, zip code, status, or folio..."
                />
            </Grid>
        </Grid>
    );
};
