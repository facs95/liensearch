import React from "react";
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    makeStyles,
    TableContainer,
    withStyles,
    TablePagination,
} from "@material-ui/core";
import { Order } from "../Interfaces";
import { useHistory } from "react-router-dom";
import { StatusChip } from "./StatusChip";

const headers = [
    "Address",
    "Order # / File Name",
    "Folio",
    "Status",
    "Created",
    "Closing Date",
];

const StyledTableRow = withStyles((theme) => ({
    root: {
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

interface Props {
    orders: Order[];
    page: number;
    totalOrders: number;
    rowsPerPage: number;
    setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const OrderTable = ({
    orders,
    page,
    totalOrders,
    rowsPerPage,
    setRowsPerPage,
    setPage,
}: Props) => {
    const classes = useStyles();
    return (
        <Paper>
            <TableContainer className={classes.container}>
                <Table size="small" stickyHeader className={classes.table}>
                    <TableHead>
                        <TableRow>
                            {headers.map((entry, index) => (
                                <TableCell size="medium" key={`header${index}`}>
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
            </TableContainer>
            <TablePagination
                component="div"
                {...{ page }}
                {...{ rowsPerPage }}
                count={totalOrders}
                nextIconButtonProps={{
                    disabled: orders.length < rowsPerPage,
                }}
                onChangePage={(_, page) => setPage(page)}
                onChangeRowsPerPage={(e) =>
                    setRowsPerPage(parseInt(e.target.value))
                }
            />
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
        <StyledTableRow
            onClick={() => onClick(order.objectID)}
            className={classes.pointer}
        >
            <TableCell>{order.address.address1 || "--"}</TableCell>
            <TableCell>{order.orderNumber || "--"}</TableCell>
            <TableCell>{order.folio || "--"}</TableCell>
            <TableCell>
                <StatusChip size="small" status={order.status} />
            </TableCell>
            <TableCell>
                {new Date(order.created_on).toDateString() || "--"}
            </TableCell>
            <TableCell>
                {new Date(order.closingDate).toDateString() || "--"}
            </TableCell>
        </StyledTableRow>
    );
};

const useStyles = makeStyles(() => ({
    pointer: {
        cursor: "pointer",
    },
    container: {
        height: "calc(100vh - 280px)",
        whiteSpace: "nowrap",
    },
    table: {},
}));
