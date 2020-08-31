import React from "react";
import { TextField, MenuItem } from "@material-ui/core";
import { OrderStatusEnum, orderStatusEnumKeys } from "../Interfaces";


interface Props {
    status: orderStatusEnumKeys | '';
    setStatus: React.Dispatch<React.SetStateAction<orderStatusEnumKeys | ''>>
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
            onChange={(e) => setStatus(e.target.value as orderStatusEnumKeys)}
        >
            <MenuItem value="">All</MenuItem>
            {Object.keys(OrderStatusEnum).map((s, index) => (
                <MenuItem key={`${index}-${s}`} value={s}>
                    {OrderStatusEnum[s as orderStatusEnumKeys]}
                </MenuItem>
            ))}
        </TextField>
    );
};
