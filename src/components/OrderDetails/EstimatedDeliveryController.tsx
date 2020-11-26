import React from "react";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

interface Props {
    estimatedDelivery: string;
    setEstimatedDelivery: React.Dispatch<React.SetStateAction<string>>;
}

export const EstimatedDeliveryController = ({
    estimatedDelivery,
    setEstimatedDelivery,
}: Props) => {

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                fullWidth
                variant="inline"
                size="small"
                format="MM/dd/yyyy"
                id="date-picker-inline"
                inputVariant="outlined"
                emptyLabel="Not Determined"
                value={estimatedDelivery || null}
                disablePast
                onChange={(e) => {
                    const newDate = e?.toLocaleDateString();
                    setEstimatedDelivery(newDate || '');
                }}
                KeyboardButtonProps={{
                    "aria-label": "change date",
                }}
            />
        </MuiPickersUtilsProvider>
    );
};
