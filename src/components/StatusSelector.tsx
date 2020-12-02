import React from "react";
import { TextField, MenuItem } from "@material-ui/core";
import { OrderTypeStatusEnum, orderTypeStatusEnumKeys } from "../Interfaces";


interface Props {
    status: orderTypeStatusEnumKeys | '';
    setStatus: React.Dispatch<React.SetStateAction<orderTypeStatusEnumKeys | ''>>
    withLabel?: boolean
}

export const StatusSelector = ({ status, setStatus, withLabel }: Props) => {
    return (
        <TextField
            label={withLabel ? 'Status' : undefined}
            select
            value={status}
            variant="outlined"
            fullWidth
            size="small"
            onChange={(e) => setStatus(e.target.value as orderTypeStatusEnumKeys)}
        >
            <MenuItem value="">All</MenuItem>
            {Object.keys(OrderTypeStatusEnum).map((s, index) => (
                <MenuItem key={`${index}-${s}`} value={s}>
                    {OrderTypeStatusEnum[s as orderTypeStatusEnumKeys]}
                </MenuItem>
            ))}
        </TextField>
    );
};
