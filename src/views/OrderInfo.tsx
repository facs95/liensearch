import React, { useEffect, useState, useContext, useCallback } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import firebase from "firebase/app";
import { Order, OrderStatusEnum } from "../Interfaces";
import {
    Paper,
    Grid,
    makeStyles,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
} from "@material-ui/core";
import { LoadingContext } from "../context/LoadingContext";
import { DisplayOrder } from "../components/DisplayOrder";
import { OrderDetails } from "../components/OrderDetails/OrderDetails";
import { UploadDocuments } from "../components/UploadDocuments";
import { TitleContext } from "../context/TitleContext";
import { RouterParams } from "../Routes";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { getAddressStr } from "../utils/orders";
import {
    CustomAccordion,
    CustomAccordionProps,
} from "../components/CutomAccordion";
import { KPI } from "../components/KPI";
import Battery80Icon from "@material-ui/icons/Battery80";
import PersonIcon from "@material-ui/icons/Person";
import { ActionButtonContext } from "../context/ActionButtonContext";
import { UserContext } from "../context/UserContext";
import { ModifyOrderDrawer } from "../components/ModifyOrderDrawer";

export const OrderInfo = () => {
    const [order, setOrder] = useState<Order | null>(null);

    const classes = useStyles();

    const { setLoading } = useContext(LoadingContext);
    const { setTitle } = useContext(TitleContext);
    const { setActionButton } = useContext(ActionButtonContext);
    const user = useContext(UserContext);
    const history = useHistory();
    const {
        pathname,
        state: { updateOrder } = { updateOrder: false },
    } = useLocation<{ updateOrder: boolean }>();

    useEffect(() => {
        setTitle("Order");
    }, [setTitle]);

    useEffect(() => {
        if (user?.admin) {
            setActionButton({
                label: "Modify Order",
                action: () =>
                    history.push({
                        pathname,
                        state: {
                            updateOrder: true,
                        },
                    }),
            });
        } else {
            setActionButton({
                label: "Update Order",
                action: () => history.push(`/update/${order?.id}/1`),
            });
        }

        return () => {
            setActionButton(null);
        };
    }, [setActionButton, user, order, history, pathname]);

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
    }, [db, id, setLoading ])

    useEffect(() => {
        setLoading(true);
        refreshOrder()
    }, [setLoading, refreshOrder]);

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
    // {/* <Grid item sm={12} md={8}>
    //         {orderData}
    //     </Grid>
    //     <Grid
    //         item
    //         container
    //         direction="column"
    //         sm={12}
    //         md={4}
    //         spacing={3}
    //     >
    //         <Grid item container>
    //             <OrderDetails {...{ order }} orderId={id} />
    //         </Grid>
    //         <Grid item container>
    //             <UploadDocuments orderId={id} orgId={order.orgId} />
    //         </Grid>
    //     </Grid> */}

    const kpis = [
        {
            title: "Status",
            value: OrderStatusEnum[order.status],
            icon: <Battery80Icon />,
        },
        {
            title: "Asignee",
            value: order.assignee,
            icon: <PersonIcon />,
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
                {...{refreshOrder}}
            />
            <Grid container direction="column" spacing={3}>
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

const useStyles = makeStyles((theme) => ({
    cardContainer: {
        padding: theme.spacing(3),
    },
    accordion: {
        width: "100%",
    },
}));
