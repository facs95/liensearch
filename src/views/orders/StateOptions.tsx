import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
} from "@material-ui/core";
import React from "react";
import { OrderTypeStatusEnum, orderTypeStatusEnumKeys } from "../../Interfaces";
import { OrderStateFilterInterface, UpdateFormType } from "./Filters";

interface Props {
    state: OrderStateFilterInterface;
    dispatch: UpdateFormType;
}

export const StateOptions = ({ state, dispatch }: Props) => {
    return (
        <FormControl component="fieldset">
            <FormGroup>
                {Object.keys(OrderTypeStatusEnum).map((key) => (
                    <FormControlLabel
                        key={`state-${key}`}
                        control={
                            <Checkbox
                                checked={
                                    state.orderState[
                                        key as orderTypeStatusEnumKeys
                                    ]
                                }
                                onChange={dispatch}
                                name={`orderState.${key}`}
                            />
                        }
                        label={
                            OrderTypeStatusEnum[key as orderTypeStatusEnumKeys]
                        }
                    />
                ))}
            </FormGroup>
        </FormControl>
    );
};
