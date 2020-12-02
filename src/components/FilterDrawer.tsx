import { Button, Grid, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { orderTypeStatusEnumKeys, orderTypeEnumKeys } from "../Interfaces";
import { CustomDrawer } from "./CustomDrawer";
import { OrderTypeSelector } from "./OrderTypeSelector";
import { OrgSelector } from "./OrgSelector";
import { StatusSelector } from "./StatusSelector";
import { forOwn } from "lodash";
import { FilterOptions } from "./Filters";
import { OrderAssigneeController } from "./SelectEmployee";

interface Props {
    open: boolean;
    onClose: () => void;
    filters: FilterOptions;
}

export const FilterDrawer = ({ open, onClose, filters }: Props) => {
    const { status, organizations, orderType, employee } = filters;

    const [filterStatus, setFilterStatus] = useState<orderTypeStatusEnumKeys | "">(
        status.value
    );
    const [filterOrg, setFilterOrg] = useState(organizations?.value ?? "");
    const [filterEmployee, setFilterEmployee] = useState(employee?.value ?? "");
    const [filterOrderType, setFilterOrderType] = useState<
        orderTypeEnumKeys | ""
    >(orderType.value);

    const clearFilters = () => {
        forOwn(filters, (value) => value && value.setter(""));
        setFilterOrg("");
        setFilterStatus("");
        setFilterOrderType("");
        setFilterEmployee('');
    };

    const applyFilter = () => {
        status.setter(filterStatus);
        orderType.setter(filterOrderType);
        if (organizations) organizations.setter(filterOrg);
        if (employee) employee.setter(filterEmployee)
    };

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
            {employee && (
                <Grid item container direction="column" spacing={1}>
                    <Grid item>
                        <Typography variant="h6">Employee Assigned</Typography>
                    </Grid>
                    <Grid item>
                        <OrderAssigneeController
                            currentAssignee={filterEmployee}
                            setCurrentAssignee={setFilterEmployee}
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
