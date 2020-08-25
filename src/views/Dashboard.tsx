import React, {
    useEffect,
    useState,
    useContext,
    useMemo,
    useCallback,
} from "react";
import firebase from "firebase/app";
import {
    Grid,
    Typography,
    Button,
    makeStyles,
    CircularProgress,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { Order, orderStatusEnumKeys, orderTypeEnumKeys } from "../Interfaces";
import { LoadingContext } from "../context/LoadingContext";
import { UserContext } from "../context/UserContext";
import { OrderTable } from "../components/OrderTable";

import { Filters, FilterOptions } from "../components/Filters";

function storeData(
    arr: Array<Order>,
    doc: firebase.firestore.QueryDocumentSnapshot<
        firebase.firestore.DocumentData
    >
) {
    arr.push({ ...doc.data(), id: doc.id } as Order);
}

export const Dashboard: React.FC = () => {
    const history = useHistory();
    const [orders, serOrders] = useState<Order[]>([]);

    const [filterStatus, setFilterStatus] = useState<orderStatusEnumKeys | "">(
        ""
    );
    const [filterOrg, setFilterOrg] = useState("");
    const [filterOrderType, setFilterOrderType] = useState<
        orderTypeEnumKeys | ""
    >("");

    const user = useContext(UserContext);
    const { setLoading, loading } = useContext(LoadingContext);

    const db = firebase.firestore();

    const classes = useStyles();

    console.log(filterOrderType);

    const checkQuery = (
        query:
            | firebase.firestore.Query<firebase.firestore.DocumentData>
            | undefined,
        ref: firebase.firestore.CollectionReference<
            firebase.firestore.DocumentData
        >
    ) => (query ? query : ref);

    const generateQuery = useCallback(
        (
            ref: firebase.firestore.CollectionReference<
                firebase.firestore.DocumentData
            >
        ) => {
            let query;
            if (!user?.admin) {
                query = ref.where("orgId", "==", user && user.orgId);
            }
            if (filterStatus) {
                query = checkQuery(query, ref).where(
                    "status",
                    "==",
                    filterStatus
                );
            }
            if (filterOrg) {
                query = checkQuery(query, ref).where("orgId", "==", filterOrg);
            }
            if (filterOrderType) {
                query = checkQuery(query, ref).where(
                    `orderType.${filterOrderType}`,
                    "==",
                    true
                );
            }
            return checkQuery(query, ref).orderBy("created_on", "desc");
        },
        [filterStatus, user, filterOrg, filterOrderType]
    );

    useEffect(() => {
        setLoading(true);
        const refOrders = db.collection("orders");
        if (user?.admin) {
            const query = generateQuery(refOrders);
            query
                .get()
                .then((querySnapshot) => {
                    const arr: Array<Order> = [];
                    querySnapshot.forEach((doc) => {
                        storeData(arr, doc);
                    });
                    serOrders(arr);
                })
                .catch((err) => console.log(err))
                .finally(() => {
                    setLoading(false);
                });
        } else {
            const query = generateQuery(refOrders);
            query
                .get()
                .then((querySnapshot) => {
                    const arr: Array<Order> = [];
                    querySnapshot.forEach((doc) => {
                        storeData(arr, doc);
                    });
                    serOrders(arr);
                })
                .catch((err) => console.log(err))
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [db, user, setLoading, generateQuery]);

    const isAdmin = user?.admin;

    let filtersOptions: FilterOptions = {
        status: {
            value: filterStatus,
            setter: setFilterStatus,
        },
        orderType: {
            value: filterOrderType,
            setter: setFilterOrderType,
        },
    };

    if (isAdmin)
        filtersOptions.organizations = {
            value: filterOrg,
            setter: setFilterOrg,
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
                {!isAdmin && (
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
                )}
            </Grid>
            <Grid item container spacing={3} direction="column">
                <Filters filters={filtersOptions} {...{ isAdmin }} />
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Grid item>
                        <OrderTable {...{ orders }} {...{ isAdmin }} />
                    </Grid>
                )}
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
