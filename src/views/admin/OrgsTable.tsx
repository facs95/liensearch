import {
    Divider,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@material-ui/core";
import React from "react";
import { Org } from "../../Interfaces";

interface Props {
    orgs: Org[];
}

const columns = ["Organization", "ID", "Phone Number", "Orders"];

export const OrgsTable = ({ orgs }: Props) => {
    const records = orgs.map((org) => ({
        columns: [
            {
                value: org.name,
            },
            {
                value: org.id,
            },
            {
                value: org.phoneNumber,
            },
            {
                value: org.orderCount,
            },
        ],
    }));

    return (
        <Grid container direction="column" spacing={2}>
            <Grid item container direction="column" wrap="nowrap">
                <Grid item xs={12}>
                    <Typography variant="h6">Organizations</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
            </Grid>
            <Grid item>
                <Table component={Paper}>
                    <TableHead>
                        <TableRow>
                            {columns.map((column, index) => (
                                <TableCell key={`orgs-columns-${index}`}>
                                    {column}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records.map((row, index) => (
                            <TableRow key={`orgs-row-${index}`}>
                                {row.columns.map((col, index) => (
                                    <TableCell
                                        key={`${columns[index]}-cell-${index}`}
                                    >
                                        <Typography>{col.value}</Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Grid>
        </Grid>
    );
};
