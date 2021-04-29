import { Button, Checkbox, Grid, Typography } from "@material-ui/core";
import produce from "immer";
import { has, set } from "lodash";
import React, { useEffect, useReducer } from "react";
import { CustomDrawer } from "../../components/CustomDrawer";
import { orderTypeStatusEnumKeys } from "../../Interfaces";
import { OrgSelector } from "./OrgSelector";
import { SelectEmployee } from "./SelectEmployee";

export interface OrderStateFilterInterface {
    organizations: string;
    employee: string;
    orderState: {
        [K in orderTypeStatusEnumKeys]: boolean;
    };
    _value?: any;
    _path?: string[];
}

export const orderStateFilterInitialState: OrderStateFilterInterface = {
    organizations: "",
    employee: "",
    orderState: {
        newOrder: false,
        hold: false,
        informationReceived: false,
        informationRequested: false,
        cancelled: false,
        finalized: false,
        pendingPayment: false,
    },
};

function enhancedReducer(
    state: OrderStateFilterInterface,
    updateArg:
        | ((
              state: OrderStateFilterInterface
          ) => Partial<OrderStateFilterInterface>)
        | Partial<OrderStateFilterInterface>
) {
    // check if the type of update argument is a callback function
    if (typeof updateArg === "function") {
        return { ...state, ...updateArg(state) };
    }

    // if the type of update argument is an object
    if (typeof updateArg === "object") {
        // does the update object have _path and _value as it's keys
        // if yes then use them to update deep object values
        if (has(updateArg, "_path") && has(updateArg, "_value")) {
            const { _path, _value } = updateArg;

            return produce(state, (draft) => {
                set(draft, _path!, _value);
            });
        } else {
            return { ...state, ...updateArg };
        }
    }
    return state;
}

export type UpdateFormType = (e: {
    target: {
        value: string | boolean;
        type: HTMLInputElement["type"];
        name: string;
    };
}) => void;

interface Props {
    filters: OrderStateFilterInterface;
    setFilters: React.Dispatch<React.SetStateAction<OrderStateFilterInterface>>;
    open: boolean;
    onClose: () => void;
}
export const Filters = ({ filters, setFilters, open, onClose }: Props) => {
    const [state, dispatch] = useReducer(
        enhancedReducer,
        orderStateFilterInitialState
    );

    const updateForm = React.useCallback<UpdateFormType>(
        ({ target: { value, name, type } }) => {
            const updatePath = name.split(
                "."
            ) as (keyof OrderStateFilterInterface)[];

            // if the input is a checkbox then use callback function to update
            // the toggle state based on previous state

            // if we have to update the root level nodes in the form
            if (updatePath.length === 1) {
                const [key] = updatePath;
                dispatch({
                    [key]: value,
                });
            }

            // if we have to update nested nodes in the form object
            // use _path and _value to update them.
            if (updatePath.length === 2) {
                if (type === "checkbox") {
                    dispatch((state) => {
                        return produce(state, (draft) => {
                            set(
                                draft,
                                updatePath,
                                !state[updatePath[0]][updatePath[1]]
                            );
                        });
                    });
                } else {
                    dispatch({
                        _path: updatePath,
                        _value: value,
                    });
                }
            }
        },
        []
    );

    const clearFilters = () => {
        dispatch(orderStateFilterInitialState);
        setFilters(orderStateFilterInitialState);
        onClose();
    };

    const applyFilter = () => {
        setFilters(state);
        onClose();
    };

    useEffect(() => {
        if (open) {
            dispatch(filters);
        }
    }, [open, filters]);

    const content = (
        <Grid container direction="column" spacing={3}>
            <Grid item container direction="column" spacing={1}>
                <Grid item>
                    <Typography variant="h6">Organization</Typography>
                </Grid>
                <Grid item>
                    <OrgSelector
                        orgId={state["organizations"]}
                        dispatch={updateForm}
                    />
                </Grid>
            </Grid>
            <Grid item container direction="column" spacing={1}>
                <Grid item>
                    <Typography variant="h6">Employee</Typography>
                </Grid>
                <Grid item>
                    <SelectEmployee
                        currentEmployee={state["employee"]}
                        dispatch={updateForm}
                    />
                </Grid>
            </Grid>
            <Grid item>
                <Button
                    fullWidth
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={applyFilter}
                >
                    Apply Filters
                </Button>
            </Grid>
            <Grid item>
                <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    onClick={clearFilters}
                >
                    Clear Filters
                </Button>
            </Grid>
        </Grid>
    );

    return (
        <CustomDrawer
            header="Filter"
            {...{ content }}
            {...{ open }}
            {...{ onClose }}
        />
    );
};
