import React, { useEffect, useState, useContext } from "react";
import * as firebase from "firebase/app";
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Grid,
    Typography,
    Button,
    makeStyles,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { Order } from "../Interfaces";
import { LoadingContext } from "../context/LoadingContext";

const headers = ["Order", "Address", "Created"];

export const Dashboard: React.FC = () => {
    const history = useHistory();
    const [orders, serOrders] = useState<Order[]>([]);

    const { setLoading } = useContext(LoadingContext);

    const db = firebase.firestore();
    const user = firebase.auth().currentUser;

    const classes = useStyles();

    useEffect(() => {
        setLoading(true);
        db.collection("orders")
            .where("userId", "==", user?.uid)
            .get()
            .then((querySnapshot) => {
                const arr: Array<Order> = [];
                querySnapshot.forEach((doc) => {
                    arr.push({ ...doc.data(), id: doc.id } as Order);
                });
                serOrders(arr);
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setLoading(false);
            });
    }, [db, user, setLoading]);

    const onClick = (id: string) => {
        history.push(`/order/${id}`);
    };

    return (
        <Grid
            item
            container
            direction="column"
            spacing={5}
            className={classes.container}
        >
            <Grid
                item
                container
                wrap="nowrap"
                justify="space-between"
                alignItems="center"
            >
                <Grid item>
                    <Typography variant="h5">My Orders</Typography>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => history.push("/new-order/1")}
                    >
                        New Order
                    </Button>
                </Grid>
            </Grid>
            <Grid item>
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
                            {orders.length > 0 &&
                                orders?.map((entry, index) => (
                                    <TableRow
                                        onClick={() => onClick(entry.id)}
                                        hover
                                        className={classes.pointer}
                                        key={`liensearch${index}`}
                                    >
                                        <TableCell>
                                            {entry.folio || "--"}
                                        </TableCell>
                                        <TableCell>
                                            {entry.address.address1 || "--"}
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
            </Grid>
        </Grid>
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
