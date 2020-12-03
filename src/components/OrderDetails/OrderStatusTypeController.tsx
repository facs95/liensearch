import React from "react";
import { TextField, MenuItem } from "@material-ui/core";
import {
    OrderTypeStatusEnum, orderTypeStatusEnumKeys
} from "../../Interfaces";

interface Props {
    currentStatus: orderTypeStatusEnumKeys;
    setCurrentStatus: React.Dispatch<
        React.SetStateAction<orderTypeStatusEnumKeys>
    >;
}

export const OrderStatusTypeController = ({
    currentStatus,
    setCurrentStatus,
}: Props) => {

    return (
        <TextField
            select
            variant="outlined"
            fullWidth
            size="small"
            value={currentStatus}
            onChange={(e) =>
                setCurrentStatus(e.target.value as orderTypeStatusEnumKeys)
            }
        >
            {Object.keys(OrderTypeStatusEnum).map((option, index) => (
                <MenuItem key={`status-${index}`} value={option}>
                    {OrderTypeStatusEnum[option as orderTypeStatusEnumKeys]}
                </MenuItem>
            ))}
        </TextField>
    );
};
