import React, { useContext, useMemo, useState } from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import { Order } from "../Interfaces";
import { OrderStatusController } from "./OrderDetails/OrdetStatusController";
import { CustomDrawer } from "./CustomDrawer";
import { OrderAssigneeController } from "./OrderDetails/OrderAssigneeController";
import firebase from "firebase/app";
import { SnackContext } from "../context/SnackContext";
import { EstimatedDeliveryController } from "./OrderDetails/EstimatedDeliveryController";

interface Props {
    open: boolean;
    onClose: () => void;
    order: Order;
    refreshOrder: () => void;
}

export const ModifyOrderDrawer = ({
    open,
    onClose,
    order,
    refreshOrder,
}: Props) => {
    const [currentStatus, setCurrentStatus] = useState(order.status);
    const [currentAssignee, setCurrentAssignee] = useState(order.assignee);
    const [estimatedDelivery, setEstimatedDelivery] = useState(
        order.estimatedDelivery || ""
    );

    const db = firebase.firestore();
    const [loading, setLoading] = useState(false);
    const { setMessage, setMessageType } = useContext(SnackContext);

    const newStatus = useMemo(() => {
        const newstat = { ...order };
        newstat.assignee = currentAssignee;
        newstat.status = currentStatus;
        newstat.estimatedDelivery = estimatedDelivery;
        return newstat;
    }, [currentAssignee, currentStatus, estimatedDelivery, order]);

    const onApply = async () => {
        setLoading(true);
        try {
            await db.collection("orders").doc(order.id).update(newStatus);
            refreshOrder();
            setMessageType("success");
            setMessage("Order was modified");
        } catch (err) {
            setMessageType("error");
            setMessage(err.message || err);
        } finally {
            setLoading(false);
        }
    };

    const content = (
        <Grid container direction="column" spacing={3}>
            <Grid item container direction="column" spacing={1}>
                <Grid item>
                    <Typography variant="h6">Order Status</Typography>
                </Grid>
                <Grid item>
                    <OrderStatusController
                        {...{ currentStatus }}
                        {...{ setCurrentStatus }}
                    />
                </Grid>
            </Grid>
            <Grid item container direction="column" spacing={1}>
                <Grid item>
                    <Typography variant="h6">Asignee Employee</Typography>
                </Grid>
                <Grid item>
                    <OrderAssigneeController
                        {...{ currentAssignee }}
                        {...{ setCurrentAssignee }}
                    />
                </Grid>
            </Grid>
            <Grid item container direction="column" spacing={1}>
                <Grid item>
                    <Typography variant="h6">Estimated Delivery</Typography>
                </Grid>
                <Grid item>
                    <EstimatedDeliveryController
                        {...{ estimatedDelivery }}
                        {...{ setEstimatedDelivery }}
                    />
                </Grid>
            </Grid>
            <Grid item>
                <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    onClick={onApply}
                    disabled={loading}
                >
                    Aplly Changes
                </Button>
            </Grid>
        </Grid>
    );

    return (
        <CustomDrawer
            {...{ onClose }}
            {...{ open }}
            header="Modify Order"
            {...{ content }}
        />
    );
};
