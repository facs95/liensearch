import React, { useState, useMemo, useContext } from "react";
import {
    Paper,
    Grid,
    makeStyles,
    Typography,
    Divider,
    Button,
} from "@material-ui/core";
import { OrderStatusController } from "./OrdetStatusController";
import { Order } from "../../Interfaces";
import { OrderAssigneeController } from "./OrderAssigneeController";
import { isEqual } from "lodash";
import firebase from "firebase/app";
import { UserContext } from "../../context/UserContext";
import { WarnModal } from "../WarnModal";
import { MessageSnackbar } from "../SnackMessage";

interface Props {
    order: Order;
    orderId: string;
}

export const OrderDetails = ({ order, orderId }: Props) => {
    const [currentStatus, setCurrentStatus] = useState(order.status);
    const [currentAssignee, setCurrentAssignee] = useState(
        order.assignee
    );
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [message, setMessage] = useState('');

    const user = useContext(UserContext);
    const db = firebase.firestore();

    const classes = useStyles();

    const newStatus = useMemo(() => {
        const newstat = { ...order };
        newstat.assignee = currentAssignee;
        newstat.status = currentStatus;
        return newstat;
    }, [currentAssignee, currentStatus, order]);

    
    const onApply = async () => {
        setLoading(true);
        try {
            await db
                .collection("orders")
                .doc(orderId)
                .update(newStatus);
        } catch (err) {
            setMessage(err.message || err);
        } finally {
            setLoading(false);
        }
    };

    const onHold = () => {
        setModalTitle("You want to put this order on Hold?");
        setOpen(true);
    };

    const onCancel = () => {
        setModalTitle("You want cancel this order?");
        setOpen(true);
    };

    return (
        <>
            <MessageSnackbar {...{message}} {...{setMessage}} />
            <WarnModal
                {...{ open }}
                {...{ setOpen }}
                title={modalTitle}
                description="Please send an email to facs95@gmail.com with the request and we will take care of it."
            />
            <Paper className={classes.paper}>
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
                    {user?.admin ? (
                        <Grid item container>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={
                                    isEqual(order, newStatus) || loading
                                }
                                onClick={onApply}
                            >
                                Apply Changes
                            </Button>
                        </Grid>
                    ) : (
                        <Grid
                            item
                            container
                            direction="column"
                            spacing={1}
                        >
                            <Grid item xs={6}>
                                <Button
                                    fullWidth
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    onClick={onHold}
                                >
                                    Hold
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    onClick={onCancel}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </>
    );
};

const useStyles = makeStyles((theme) => ({
    cardContainer: {
        padding: theme.spacing(3),
    },
    paper: {
        width: '100%'
    }
}));
