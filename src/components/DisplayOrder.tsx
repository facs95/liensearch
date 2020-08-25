import React, { useContext, useState, useEffect } from "react";
import { Grid, Typography, Divider, Button } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import { Order, OrderType, OrderData, Org, CreateOrder } from "../Interfaces";
import { UserContext } from "../context/UserContext";
import firebase from "firebase";
import { useHistory } from "react-router-dom";

interface Props {
    order: Order | CreateOrder;
    type: "create" | "info";
}

const orderTypeText = new Map<keyof OrderType, string>([
    ["lienSearch", "Lien Search"],
    ["estoppelLetter", "Estoppel Letter"],
    ["landSurvey", "Land Survey"],
    ["permitResolution", "Permit Resolution"],
]);

const orderInfoText = new Map<keyof OrderData, string>([
    ["folio", "Folio"],
    ["legalDescription", "legal Description"],
    ["closingDate", "Closing Date"],
    ["neededDate", "Needed Date"],
    ["seller", "Seller"],
    ["buyer", "Buyer"],
    ["listingAgent", "Listing Agent"],
    ["listingAgentPhone", "Listing Agent Phone"],
]);

const orderDetails: Array<keyof OrderData> = [
    "folio",
    "closingDate",
    "neededDate",
    "buyer",
    "listingAgent",
    "listingAgentPhone",
    "legalDescription",
];

export const DisplayOrder = ({ order, type }: Props) => {
    const userData = useContext(UserContext);
    const db = firebase.firestore();
    const history = useHistory();

    const [org, setOrg] = useState<Org | null>(null);
    const [requestedBy, setRequestedBy] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (order.orgId) {
            db.collection("organizations")
                .doc(order.orgId)
                .get()
                .then((doc) => {
                    if (!doc.exists) setOrg(null);
                    setOrg(doc.data() as Org);
                })
                .catch((err) => console.log(err))
                .finally(() => setLoading(false));
        } else {
            setOrg(null);
            setLoading(false);
        }
    }, [order, db]);

    useEffect(() => {
        if (type === "info" && order.requestedBy) {
            db.collection("users")
                .doc(order.requestedBy)
                .get()
                .then((doc) => {
                    if (!doc.exists) setRequestedBy(null);
                    setRequestedBy(doc.data()?.email ?? ("" as string));
                })
                .catch((err) => console.log("here", err))
                .finally(() => setLoading(false));
        } else {
            setRequestedBy(userData?.email ?? "");
        }
    }, [order, type, db, userData]);

    const getOrderTypes = () => {
        const elements = [];
        for (let [key, value] of Object.entries(order.orderType)) {
            const el = (
                <Grid
                    item
                    container
                    alignItems="center"
                    justify="space-between"
                    key={key}
                >
                    <Grid item>
                        <Typography variant="body1">
                            {orderTypeText.get(key as keyof OrderType)}
                        </Typography>
                    </Grid>
                    <Grid item>{value ? <CheckIcon /> : <CloseIcon />}</Grid>
                </Grid>
            );
            elements.push(el);
        }
        return elements;
    };

    const displayInfo = () => {
        return orderDetails.map((detail) => {
            return (
                <Grid
                    item
                    container
                    alignItems="center"
                    justify="space-between"
                    key={detail}
                >
                    <Grid item xs={4}>
                        <Typography variant="body1">
                            {orderInfoText.get(detail)}
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="body2">
                            {order[detail] ?? ""}
                        </Typography>
                    </Grid>
                </Grid>
            );
        });
    };

    const OwnerInfo = (
        <>
            <Grid item container alignItems="center" justify="space-between">
                <Grid item>
                    <Typography variant="body1">Requested By</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body2">
                        {requestedBy ?? "No User Found"}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item container alignItems="center" justify="space-between">
                <Grid item>
                    <Typography variant="body1">Company</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body2">
                        {org ? org.name : "No Company Found"}
                    </Typography>
                </Grid>
            </Grid>
        </>
    );

    function isOrder(order: Order | CreateOrder): order is Order {
        return true;
    }

    if (loading) return <></>;

    return (
        <>
            <Grid item>
                <Typography variant="h5">Review Order</Typography>
                <Divider />
            </Grid>
            <Grid item container spacing={3}>
                {type === "info" && (
                    <Grid item container direction="column" spacing={1} xs={4}>
                        <Grid item>
                            <Typography variant="h6">Order Owner</Typography>
                            <Divider />
                        </Grid>
                        {OwnerInfo}
                    </Grid>
                )}
                <Grid
                    item
                    container
                    xs={type === "info" ? 4 : 3}
                    spacing={1}
                    direction="column"
                >
                    <Grid item>
                        <Typography variant="h6">Property Address</Typography>
                        <Divider />
                    </Grid>
                    <Grid item container direction="column" spacing={1}>
                        <Grid item>
                            <Typography>{order?.address.address1}</Typography>
                        </Grid>
                        {order?.address.address2 && (
                            <Grid item>
                                <Typography>
                                    {order.address.address2}
                                </Typography>
                            </Grid>
                        )}
                        {order?.address.unit && (
                            <Grid item>
                                <Typography>{order.address.unit}</Typography>
                            </Grid>
                        )}
                        <Grid item>
                            <Typography>{`${order?.address.city}, ${order?.address.state} ${order?.address.zipCode}`}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    item
                    container
                    direction="column"
                    xs={type === "info" ? 4 : 3}
                    spacing={1}
                >
                    <Grid item>
                        <Typography variant="h6">Order Type</Typography>
                        <Divider />
                    </Grid>
                    {getOrderTypes()}
                </Grid>

                <Grid
                    item
                    container
                    xs={type === "info" ? 12 : 6}
                    direction="column"
                    spacing={1}
                >
                    <Grid item>
                        <Typography variant="h6">Order Details</Typography>
                        <Divider />
                    </Grid>
                    {displayInfo()}
                </Grid>
                {isOrder(order) &&
                    type === "info" &&
                    order.status !== "cancelled" &&
                    order.status !== "finalized" && (
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                    history.push(`/update/${order.id}/1`)
                                }
                            >
                                Update Order
                            </Button>
                        </Grid>
                    )}
            </Grid>
        </>
    );
};
