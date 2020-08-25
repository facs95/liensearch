import React from "react";
import { TextField, MenuItem } from "@material-ui/core";
import { OrderTypeEnum, orderTypeEnumKeys } from "../Interfaces";

interface Props {
    orderType: orderTypeEnumKeys | '';
    setOrderType: React.Dispatch<React.SetStateAction<orderTypeEnumKeys | ''>>
}

export const OrderTypeSelector = ({ orderType, setOrderType }: Props) => {
    return (
        <TextField
            label='Order Type'
            select
            value={orderType}
            variant="outlined"
            fullWidth
            onChange={(e) => setOrderType(e.target.value as orderTypeEnumKeys)}
        >
            <MenuItem value="">All</MenuItem>
            {Object.keys(OrderTypeEnum).map((s, index) => (
                <MenuItem key={`${index}-${s}`} value={s}>
                    {OrderTypeEnum[s as orderTypeEnumKeys]}
                </MenuItem>
            ))}
        </TextField>
    );
};
