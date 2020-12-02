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
import { Order } from "../Interfaces";
import { useHistory } from "react-router-dom";
import { StatusChip } from "./StatusChip";

const headers = [
    "Order # / File Name",
    "Address",
    "Folio",
    "Status",
    "Created",
];

interface Props {
    orders: Order[];
}

export const OrderTable = ({ orders }: Props) => {
    return (
        <Paper>
            <Table>
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
                    {orders.map((order, i) => (
                        <Row key={`order-${i}`} {...{ order }} />
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

interface RowProps {
    order: Order;
}

const Row = ({ order }: RowProps) => {
    const history = useHistory();
    const classes = useStyles();

    const onClick = (id: string) => {
        history.push(`/order/${id}`);
    };

    return (
        <TableRow
            onClick={() => onClick(order.objectID)}
            hover
            className={classes.pointer}
        >
            <TableCell>{order.orderNumber || "--"}</TableCell>
            <TableCell>{order.address.address1 || "--"}</TableCell>
            <TableCell>{order.folio || "--"}</TableCell>
            <TableCell>
                <StatusChip size="small" status={order.status} />
            </TableCell>
            <TableCell>
                {new Date(order.created_on).toLocaleString() || "--"}
            </TableCell>
        </TableRow>
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
