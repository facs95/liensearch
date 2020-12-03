import React, { useContext, useMemo, useState } from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import { Order, orderStatusEnumKeys, orderTypeEnumKeys } from "../Interfaces";
import { OrderStatusTypeController } from "./OrderDetails/OrderStatusTypeController";
import { CustomDrawer } from "./CustomDrawer";
import { OrderAssigneeController } from "./OrderDetails/OrderAssigneeController";
import firebase from "firebase/app";
import { SnackContext } from "../context/SnackContext";
import { EstimatedDeliveryController } from "./OrderDetails/EstimatedDeliveryController";
import { StatusSelector } from "./StatusSelector";

interface Props {
    open: boolean;
    onClose: () => void;
    order: Order;
    orderType?: orderTypeEnumKeys;
    refreshOrder: () => void;
}

export const ModifyOrderDrawer = ({
    open,
    onClose,
    order,
    orderType,
    refreshOrder,
}: Props) => {
    const [currentStatus, setCurrentStatus] = useState<
        orderStatusEnumKeys | ""
    >(order.status);
    const [currentTypeStatus, setCurrentTypeStatus] = useState(
        orderType ? order.orderType[orderType].status : "newOrder"
    );
    const [currentAssignee, setCurrentAssignee] = useState(
        orderType ? order.orderType[orderType].assignee : ""
    );
    const [estimatedDelivery, setEstimatedDelivery] = useState(
        orderType ? order.orderType[orderType].estimatedDelivery : ""
    );

    const db = firebase.firestore();
    const [loading, setLoading] = useState(false);
    const { setMessage, setMessageType } = useContext(SnackContext);

    const newStatus = useMemo(() => {
        const newstat = { ...order };
        if (orderType) {
            newstat.orderType[orderType].assignee = currentAssignee;
            newstat.orderType[orderType].estimatedDelivery = estimatedDelivery;
            newstat.orderType[orderType].status = newstat.orderType[
                orderType
            ].status = currentTypeStatus;
        } else {
            newstat.status = currentStatus || "inProgress";
        }
        return newstat;
    }, [
        currentAssignee,
        currentStatus,
        estimatedDelivery,
        order,
        orderType,
        currentTypeStatus,
    ]);

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
                    {orderType ? (
                        <OrderStatusTypeController
                            currentStatus={currentTypeStatus!}
                            setCurrentStatus={setCurrentTypeStatus}
                        />
                    ) : (
                        <StatusSelector
                            status={currentStatus}
                            setStatus={setCurrentStatus}
                        />
                    )}
                </Grid>
            </Grid>
            {orderType && (
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
            )}
            {orderType && (
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
            )}
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
