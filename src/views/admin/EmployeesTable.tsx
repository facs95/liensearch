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
import { Employee } from "../../Interfaces";

interface Props {
    employees: Employee[];
}

const columns = ["Name", "Email"];

export const EmployeesTable = ({ employees }: Props) => {
    const records = employees.map((org) => ({
        columns: [
            {
                value: org.name,
            },
            {
                value: org.email,
            },
        ],
    }));

    return (
        <Grid container direction="column" spacing={2}>
            <Grid item container direction="column" wrap="nowrap">
                <Grid item xs={12}>
                    <Typography variant="h6">Employees</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
            </Grid>
            <Grid item>
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableCell
                                        key={`employees-columns-${index}`}
                                    >
                                        {column}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {records.map((row, index) => (
                                <TableRow key={`employees-row-${index}`}>
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
                </Paper>
            </Grid>
        </Grid>
    );
};
