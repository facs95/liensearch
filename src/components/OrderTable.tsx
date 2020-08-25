import React from "react";
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    makeStyles,
} from "@material-ui/core";
import { Order, OrderStatusEnum } from "../Interfaces";
import { useHistory } from "react-router-dom";
import { EmptyState } from "./EmpyState";

const headers = ["Order ID", "Folio", "Address", "Status", "Created"];

interface Props {
    orders: Order[];
    isAdmin?: boolean;
}

export const OrderTable = ({ orders, isAdmin }: Props) => {
    const history = useHistory();
    const classes = useStyles();

    const onClick = (id: string) => {
        history.push(`/order/${id}`);
    };

    return (
        <>
            {orders.length === 0 ? (
                <EmptyState imageFile="orders.svg" title="No Order Found" />
            ) : (
                <Paper>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {headers.map((entry, index) => (
                                    <TableCell key={`header${index}`}>
                                        {entry}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders?.map((entry, index) => (
                                <TableRow
                                    onClick={() => onClick(entry.id)}
                                    hover
                                    className={classes.pointer}
                                    key={`liensearch${index}`}
                                >
                                    <TableCell>{entry.id || "--"}</TableCell>
                                    <TableCell>{entry.folio || "--"}</TableCell>
                                    <TableCell>
                                        {entry.address.address1 || "--"}
                                    </TableCell>
                                    <TableCell>
                                        {OrderStatusEnum[entry.status] || "--"}
                                    </TableCell>
                                    <TableCell>
                                        {entry.created_on
                                            ?.toDate()
                                            .toLocaleDateString() || "--"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            )}
        </>
    );
};

const useStyles = makeStyles(() => ({
    container: {
        width: "80vw",
    },
    pointer: {
        cursor: "pointer",
    },
}));
