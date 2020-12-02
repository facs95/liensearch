import React from "react";
import { TextField, MenuItem } from "@material-ui/core";
import {
    orderStatusEnumKeys as orderStatusType,
    OrderStatusEnum,
} from "../../Interfaces";

interface Props {
    currentStatus: orderStatusType;
    setCurrentStatus: React.Dispatch<
        React.SetStateAction<keyof typeof OrderStatusEnum>
    >;
}

export const OrderStatusController = ({
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
                setCurrentStatus(e.target.value as keyof typeof OrderStatusEnum)
            }
        >
            {Object.keys(OrderStatusEnum).map((option, index) => (
                <MenuItem key={`status-${index}`} value={option}>
                    {OrderStatusEnum[option as keyof typeof OrderStatusEnum]}
                </MenuItem>
            ))}
        </TextField>
    );
};
