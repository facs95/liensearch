import { Button, Grid, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { orderStatusEnumKeys, orderTypeEnumKeys } from "../Interfaces";
import { CustomDrawer } from "./CustomDrawer";
import { OrderTypeSelector } from "./OrderTypeSelector";
import { OrgSelector } from "./OrgSelector";
import { StatusSelector } from "./StatusSelector";
import { forOwn } from "lodash";

export interface FilterOptions {
    status: {
        value: orderStatusEnumKeys | "";
        setter: React.Dispatch<React.SetStateAction<orderStatusEnumKeys | "">>;
    };
    orderType: {
        value: orderTypeEnumKeys | "";
        setter: React.Dispatch<React.SetStateAction<orderTypeEnumKeys | "">>;
    };
    organizations?: {
        value: string;
        setter: React.Dispatch<React.SetStateAction<string>>;
    };
}

interface Props {
    open: boolean;
    onClose: () => void;
    filters: FilterOptions;
}

export const FilterDrawer = ({ open, onClose, filters }: Props) => {
    const { status, organizations, orderType } = filters;

    const [filterStatus, setFilterStatus] = useState<orderStatusEnumKeys | "">(
        status.value
    );
    const [filterOrg, setFilterOrg] = useState(organizations?.value ?? '');
    const [filterOrderType, setFilterOrderType] = useState<
        orderTypeEnumKeys | ""
    >(orderType.value);

    const clearFilters = () => {
        forOwn(filters, (value) => value && value.setter(""));
        setFilterOrg('');
        setFilterStatus('');
        setFilterOrderType('')
    };

    const applyFilter = () => {
        status.setter(filterStatus);
        orderType.setter(filterOrderType);
        if (organizations) organizations.setter(filterOrg)
    }

    const content = (
        <Grid container spacing={3} direction="column">
            {status && (
                <Grid item container direction="column" spacing={1}>
                    <Grid item>
                        <Typography variant="h6">Order Status</Typography>
                    </Grid>
                    <Grid item>
                        <StatusSelector
                            status={filterStatus}
                            setStatus={setFilterStatus}
                            withLabel
                        />
                    </Grid>
                </Grid>
            )}
            {organizations && (
                <Grid item container direction="column" spacing={1}>
                    <Grid item>
                        <Typography variant="h6">Organization</Typography>
                    </Grid>
                    <Grid item>
                        <OrgSelector
                            orgId={filterOrg}
                            setOrgId={setFilterOrg}
                        />
                    </Grid>
                </Grid>
            )}
            {orderType && (
                <Grid item container direction="column" spacing={1}>
                    <Grid item>
                        <Typography variant="h6">Order Type</Typography>
                    </Grid>
                    <Grid item>
                        <OrderTypeSelector
                            orderType={filterOrderType}
                            setOrderType={setFilterOrderType}
                        />
                    </Grid>
                </Grid>
            )}
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
            {...{ open }}
            {...{ onClose }}
            header="Filter"
            {...{ content }}
        />
    );
};
