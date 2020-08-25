import React from "react";
import { Grid, Button } from "@material-ui/core";
import { StatusSelector } from "./StatusSelector";
import { OrgSelector } from "./OrgSelector";
import { orderStatusEnumKeys, orderTypeEnumKeys } from "../Interfaces";
import { OrderTypeSelector } from "./OrderTypeSelector";
import { forOwn } from "lodash";

export interface FilterOptions {
    status?: {
        value: orderStatusEnumKeys | "";
        setter: React.Dispatch<React.SetStateAction<orderStatusEnumKeys | "">>;
    };
    organizations?: {
        value: string;
        setter: React.Dispatch<React.SetStateAction<string>>;
    };
    orderType?: {
        value: orderTypeEnumKeys | "";
        setter: React.Dispatch<React.SetStateAction<orderTypeEnumKeys | "">>;
    };
}

interface Props {
    isAdmin: boolean | undefined;
    filters: FilterOptions;
}

export const Filters = ({ isAdmin, filters }: Props) => {
    const { status, organizations, orderType } = filters;

    const clearFilters = () => {
        forOwn(filters, value => value && value.setter(""));
    };

    return (
        <Grid item container spacing={3} alignItems="center">
            {status && (
                <Grid item xs={12} sm={3} md={2}>
                    <StatusSelector
                        status={status.value}
                        setStatus={status.setter}
                        withLabel
                    />
                </Grid>
            )}
            {organizations && (
                <Grid item xs={12} sm={3} md={2}>
                    <OrgSelector
                        orgId={organizations.value}
                        setOrgId={organizations.setter}
                    />
                </Grid>
            )}
            {orderType && (
                <Grid item xs={12} sm={3} md={2}>
                    <OrderTypeSelector
                        orderType={orderType.value}
                        setOrderType={orderType.setter}
                    />
                </Grid>
            )}
            <Grid item xs={12} sm={3} md={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={clearFilters}
                >
                    Clear Filters
                </Button>
            </Grid>
        </Grid>
    );
};