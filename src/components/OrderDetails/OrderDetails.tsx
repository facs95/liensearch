import React, { useState, useMemo } from "react";
import {
    Paper,
    Grid,
    makeStyles,
    Typography,
    Divider,
    Button,
} from "@material-ui/core";
import { OrderStatusController } from "./OrdetStatusController";
import { OrderStatus } from "../../Interfaces";
import { OrderAssigneeController } from "./OrderAssigneeController";
import { isEqual } from "lodash";
import * as firebase from "firebase/app";

interface Props {
    orderStatus: OrderStatus;
    orderId: string;
    statusId: string;
}

export const OrderDetails = ({ orderStatus, orderId, statusId }: Props) => {
    const [currentStatus, setCurrentStatus] = useState(orderStatus.status);
    const [currentAssignee, setCurrentAssignee] = useState(
        orderStatus.assignee
    );
    const [loading, setLoading] = useState(false);


    const db = firebase.firestore();

    const classes = useStyles();

    const newStatus = useMemo(() => {
        const newstat = { ...orderStatus };
        newstat.assignee = currentAssignee;
        newstat.status = currentStatus;
        return newstat;
    }, [currentAssignee, currentStatus, orderStatus]);

    const onApply = async () => {
        setLoading(true);
        try {
            await db
                .collection("orders")
                .doc(orderId)
                .collection("orderStatus")
                .doc(statusId)
                .update(newStatus);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper>
            <Grid
                container
                direction="column"
                spacing={3}
                className={classes.cardContainer}
            >
                <Grid item>
                    <Typography variant="h5">Order Status</Typography>
                    <Divider />
                </Grid>
                <OrderStatusController
                    {...{ currentStatus }}
                    {...{ setCurrentStatus }}
                />
                <OrderAssigneeController
                    {...{ currentAssignee }}
                    {...{ setCurrentAssignee }}
                />
                <Grid item container justify="center">
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={isEqual(orderStatus, newStatus) || loading}
                        onClick={onApply}
                    >
                        Apply Changes
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

const useStyles = makeStyles((theme) => ({
    cardContainer: {
        padding: theme.spacing(3),
    },
}));
