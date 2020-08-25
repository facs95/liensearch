import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import firebase from "firebase/app";
import { Order, OrderStatus } from "../Interfaces";
import { Paper, Grid, makeStyles, Button } from "@material-ui/core";
import { LoadingContext } from "../context/LoadingContext";
import { DisplayOrder } from "../components/DisplayOrder";
import { OrderDetails } from "../components/OrderDetails/OrderDetails";
import { UploadDocuments } from "../components/UploadDocuments";

export const OrderInfo = () => {
    const [order, setOrder] = useState<Order | null>(null);
    const [statusId, setStatusId] = useState("");

    const classes = useStyles();

    const { setLoading } = useContext(LoadingContext);

    const { id } = useParams();

    const db = firebase.firestore();

    useEffect(() => {
        setLoading(true);
        if (id) {
            db.collection("orders")
                .doc(id)
                .get()
                .then((doc) => {
                    if (!doc.exists) {
                        console.log("No such document!");
                    } else {
                        setOrder({ ...doc.data(), id: doc.id } as Order);
                    }
                })
                .catch((err) => console.log("here", err))
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [db, id, setLoading]);

    if (!order) return <> </>;

    const orderData = (
        <Paper>
            <Grid
                container
                direction="column"
                spacing={3}
                className={classes.cardContainer}
            >
                <DisplayOrder type="info" {...{ order }} />
            </Grid>
        </Paper>
    );

    return (
        <>
            <Grid item container spacing={3}>
                <Grid item xs={8}>
                    {orderData}
                </Grid>
                <Grid item container direction="column" xs={4}>
                    <Grid item>
                        <OrderDetails
                            {...{ order }}
                            orderId={id}
                            {...{ statusId }}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item container>
                <UploadDocuments orderId={id} orgId={order.orgId} />
            </Grid>
        </>
    );
};

const useStyles = makeStyles((theme) => ({
    cardContainer: {
        padding: theme.spacing(3),
    },
}));
