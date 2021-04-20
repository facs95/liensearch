import React, { useEffect, useState, useContext, useCallback } from "react";
import { Redirect, useHistory, useLocation, useParams } from "react-router-dom";
import firebase from "firebase/app";
import {
    Order,
    OrderTypeEnum,
    orderTypeEnumKeys,
    OrderTypeInterface,
    OrderTypeStatusEnum,
} from "../Interfaces";
import { CircularProgress, Grid, Typography } from "@material-ui/core";
import { DisplayOrder } from "../components/DisplayOrder";
import { UploadDocuments } from "../components/UploadDocuments";
import { TitleContext } from "../context/TitleContext";
import { RouterParams } from "../Routes";
import { KPI, KpiInterface } from "../components/KPI";
import Battery80Icon from "@material-ui/icons/Battery80";
import PersonIcon from "@material-ui/icons/Person";
import { ActionButtonContext } from "../context/ActionButtonContext";
import { UserContext } from "../context/UserContext";
import { ModifyOrderDrawer } from "../components/ModifyOrderDrawer";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import { StatusChip } from "../components/StatusChip";
import LocalAirportIcon from "@material-ui/icons/LocalAirport";
import { ActiveIcon } from "../components/ActiveIcon";
import { TaskList } from "../components/TaskList/TaskList";

export const OrderInfo = () => {
    const [order, setOrder] = useState<Order | null>(null);

    const { setTitle } = useContext(TitleContext);
    const { setNavigationBar } = useContext(ActionButtonContext);

    const [loading, setLoading] = useState(true);
    const user = useContext(UserContext);
    const history = useHistory();
    const {
        pathname,
        state: { updateOrder, modifyType } = {
            updateOrder: false,
            modifyType: undefined,
        },
    } = useLocation<{
        updateOrder: boolean;
        modifyType: orderTypeEnumKeys | undefined;
    }>();

    useEffect(() => {
        setTitle("Order Info");
    }, [setTitle]);

    useEffect(() => {
        if (user?.admin) {
            setNavigationBar({
                label: "Update Order",
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
                label: "Modify Order",
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

    useEffect(() => {
        refreshOrder();
    }, [setLoading, refreshOrder]);

    if (loading) return <CircularProgress />;
    if (!order) return <Redirect to="/" />;

    const getIsActiveComponent = (isActive: boolean) => (
        <Grid container spacing={1} alignItems="center">
            <Grid item>
                <Typography>{isActive ? "Ordered" : "Not Ordered"}</Typography>
            </Grid>
            <Grid item>
                <ActiveIcon {...{ isActive }} />
            </Grid>
        </Grid>
    );

    const getTypeData = (type: OrderTypeInterface) => {
        return [
            {
                title: "Active",
                value: getIsActiveComponent(type.isActive),
                icon: <LocalAirportIcon />,
            },
            {
                title: "Status",
                value: type.isActive ? OrderTypeStatusEnum[type.status] : "--",
                icon: <Battery80Icon />,
            },
            {
                title: "Assignee",
                value: type.isActive
                    ? type.assignee
                        ? type.assignee
                        : "Not Assigned Yet"
                    : "--",
                icon: <PersonIcon />,
            },
            {
                title: "Estimated Delivery",
                value: type.isActive
                    ? type.estimatedDelivery
                        ? type.estimatedDelivery
                        : "TBD"
                    : "--",
                icon: <CalendarTodayIcon />,
            },
        ];
    };

    const kpis: KpiInterface[] = [
        {
            title: OrderTypeEnum.lienSearch,
            data: getTypeData(order.orderType.lienSearch),
            action:
                order.orderType.lienSearch.isActive && user?.admin
                    ? () => {
                          history.push({
                              pathname,
                              state: {
                                  updateOrder: true,
                                  modifyType: "lienSearch",
                              },
                          });
                      }
                    : undefined,
        },
        {
            title: OrderTypeEnum.estoppelLetter,
            data: getTypeData(order.orderType.estoppelLetter),
            action:
                order.orderType.estoppelLetter.isActive && user?.admin
                    ? () => {
                          history.push({
                              pathname,
                              state: {
                                  updateOrder: true,
                                  modifyType: "estoppelLetter",
                              },
                          });
                      }
                    : undefined,
        },
        {
            title: OrderTypeEnum.permitResolution,
            data: getTypeData(order.orderType.permitResolution),
            action:
                order.orderType.permitResolution.isActive && user?.admin
                    ? () => {
                          history.push({
                              pathname,
                              state: {
                                  updateOrder: true,
                                  modifyType: "permitResolution",
                              },
                          });
                      }
                    : undefined,
        },
        {
            title: OrderTypeEnum.landSurvey,
            data: getTypeData(order.orderType.landSurvey),
            action:
                order.orderType.landSurvey.isActive && user?.admin
                    ? () => {
                          history.push({
                              pathname,
                              state: {
                                  updateOrder: true,
                                  modifyType: "landSurvey",
                              },
                          });
                      }
                    : undefined,
        },
    ];

    const onUpdateOrderClose = () => {
        history.push({
            pathname,
            state: {
                updateOrder: false,
                modifyType: undefined,
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
                orderType={modifyType}
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
                <Grid item container>
                    <DisplayOrder {...{ order }} type="info" />
                </Grid>
                <Grid item>
                    <KPI {...{ kpis }} />
                </Grid>
                <Grid item container spacing={2}>
                    <Grid item xs lg={user?.admin ? 6 : 12}>
                        <UploadDocuments orderId={id} orgId={order.orgId} />
                    </Grid>
                    {user?.admin && (
                        <Grid item xs lg={6}>
                            <TaskList {...{ order }} />
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </>
    );
};
