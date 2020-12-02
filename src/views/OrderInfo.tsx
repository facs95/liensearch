import React, { useEffect, useState, useContext, useCallback } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import firebase from "firebase/app";
import { Order, OrderStatusEnum } from "../Interfaces";
import { Grid, Typography } from "@material-ui/core";
import { LoadingContext } from "../context/LoadingContext";
import { DisplayOrder } from "../components/DisplayOrder";
import { UploadDocuments } from "../components/UploadDocuments";
import { TitleContext } from "../context/TitleContext";
import { RouterParams } from "../Routes";
import { KPI } from "../components/KPI";
import Battery80Icon from "@material-ui/icons/Battery80";
import PersonIcon from "@material-ui/icons/Person";
import { ActionButtonContext } from "../context/ActionButtonContext";
import { UserContext } from "../context/UserContext";
import { ModifyOrderDrawer } from "../components/ModifyOrderDrawer";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import { StatusChip } from "../components/StatusChip";

export const OrderInfo = () => {
    const [order, setOrder] = useState<Order | null>(null);

    const { setLoading } = useContext(LoadingContext);
    const { setTitle } = useContext(TitleContext);
    const { setNavigationBar } = useContext(ActionButtonContext);
    const user = useContext(UserContext);
    const history = useHistory();
    const {
        pathname,
        state: { updateOrder } = { updateOrder: false },
    } = useLocation<{ updateOrder: boolean }>();

    useEffect(() => {
        setTitle("Order Info");
    }, [setTitle]);

    useEffect(() => {
        if (user?.admin) {
            setNavigationBar({
                label: "Modify Order",
                action: () =>
                    history.push({
                        pathname,
                        state: {
                            updateOrder: true,
                        },
                    }),
                breadcrumbText: order?.orderCount,
            });
        } else {
            setNavigationBar({
                label: "Update Order",
                action: () => history.push(`/update/${order?.id}/1`),
                breadcrumbText: order?.orderCount,
            });
        }

        return () => {
            setNavigationBar(null);
        };
    }, [setNavigationBar, user, order, history, pathname]);

    const { id } = useParams<RouterParams>();

    const db = firebase.firestore();

    const refreshOrder = useCallback(() => {
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

    useEffect(() => {
        setLoading(true);
        refreshOrder();
    }, [setLoading, refreshOrder]);

    if (!order) return <> </>;

    const kpis = [
        {
            title: "Status",
            value: OrderStatusEnum[order.status],
            icon: <Battery80Icon />,
        },
        {
            title: "Asignee",
            value: order.assignee || "Not assigned yet",
            icon: <PersonIcon />,
        },
        {
            title: "Estimated Delivery",
            value: order.estimatedDelivery || "TBD",
            icon: <CalendarTodayIcon />,
        },
    ];

    const onUpdateOrderClose = () => {
        history.push({
            pathname,
            state: {
                updateOrder: false,
            },
        });
    };

    return (
        <>
            <ModifyOrderDrawer
                {...{ order }}
                open={updateOrder}
                onClose={onUpdateOrderClose}
                {...{ refreshOrder }}
            />
            <Grid container direction="column" spacing={3}>
                <Grid item container alignItems="center" spacing={2}>
                    <Grid item>
                        <Typography variant="h5">Order Status:</Typography>
                    </Grid>
                    <Grid item>
                        <StatusChip status={order.status} />
                    </Grid>
                </Grid>
                <Grid item>
                    <KPI {...{ kpis }} />
                </Grid>
                <Grid item>
                    <DisplayOrder {...{ order }} type="info" />
                </Grid>
                <Grid item>
                    <UploadDocuments orderId={id} orgId={order.orgId} />
                </Grid>
            </Grid>
        </>
    );
};
