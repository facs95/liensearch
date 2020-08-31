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

const headers = ["Order ID", "Folio", "Address", "Status", "Created"];

interface Props {
    orders: Order[]
}

export const OrderTable = ({orders}: Props) => {
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
                    {orders.map((order, i) => <Row key={`order-${i}`} {...{order}} />)}
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
            <TableCell>{order.objectID|| "--"}</TableCell>
            <TableCell>{order.folio || "--"}</TableCell>
            <TableCell>{order.address.address1 || "--"}</TableCell>
            <TableCell>{OrderStatusEnum[order.status] || "--"}</TableCell>
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
