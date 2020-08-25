import React, { useContext } from "react";
import { Grid, Typography, TextField, MenuItem } from "@material-ui/core";
import {
    orderStatusEnumKeys as orderStatusType,
    OrderStatusEnum,
} from "../../Interfaces";
import { UserContext } from "../../context/UserContext";

interface Props {
    currentStatus: orderStatusType;
    setCurrentStatus: React.Dispatch<React.SetStateAction<keyof typeof OrderStatusEnum>>
}

export const OrderStatusController = ({ currentStatus, setCurrentStatus }: Props) => {

    const user = useContext(UserContext);

    return (
        <Grid item container alignItems="center" justify="space-between">
            <Grid item>
                <Typography variant="body1">Status</Typography>
            </Grid>
            <Grid item xs={7}>
                {user?.admin ? (
                    <TextField
                        select
                        variant="outlined"
                        fullWidth
                        value={currentStatus}
                        onChange={(e) =>
                            setCurrentStatus(
                                e.target.value as keyof typeof OrderStatusEnum
                            )
                        }
                    >
                        {Object.keys(OrderStatusEnum).map((option, index) => (
                            <MenuItem key={`status-${index}`} value={option}>
                                {
                                    OrderStatusEnum[
                                        option as keyof typeof OrderStatusEnum
                                    ]
                                }
                            </MenuItem>
                        ))}
                    </TextField>
                ) : (
                    <Typography variant="body2">
                        {currentStatus ? OrderStatusEnum[currentStatus] : ""}
                    </Typography>
                )}
            </Grid>
        </Grid>
    );
};
