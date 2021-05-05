import { Box, Button, CircularProgress, Grid } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import algoliasearch from "algoliasearch/lite";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Redirect, useHistory, useLocation } from "react-router";
import { Filters, orderStateFilterInitialState } from "./Filters";
import { OrderTable } from "../../components/OrderTable";
import { ALGOLIA_CONFIG } from "../../config";
import { useUser } from "../../context/UserContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useOrderTypeParam } from "../../hooks/useOrderTypeParam";
import { Order, OrderTypeEnum } from "../../Interfaces";
import { generateOrderStateFilterQuery } from "../../utils/filters";
import { TopBar } from "./TopBar";
import { TitleContext } from "../../context/TitleContext";
import { ActionButtonContext } from "../../context/ActionButtonContext";

const FILTERS_KEY = "stateFilters";

export const Orders = () => {
    const orderType = useOrderTypeParam();
    const user = useUser();
    const { setTitle } = useContext(TitleContext);
    const { setNavigationBar } = useContext(ActionButtonContext);
    const history = useHistory();

    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [filters, setFilters] = useLocalStorage(
        FILTERS_KEY + orderType,
        orderStateFilterInitialState
    );

    useEffect(() => {
        if (orderType) {
            setTitle(OrderTypeEnum[orderType]);
        }
    }, [setTitle, orderType]);

    useEffect(() => {
        if (!user.admin) {
            setNavigationBar({
                label: "New Order",
                action: () => history.push("/new-order/1"),
            });
        }
    }, [user, setNavigationBar, history]);

    //Manage filter drawer status
    const {
        pathname,
        state: { openFilter } = { openFilter: false },
    } = useLocation<{
        openFilter: boolean;
    }>();

    const onFilterClose = () => {
        history.push({
            pathname,
            state: {
                openFilter: false,
            },
        });
    };

    const onFilterOpen = () => {
        history.push({
            pathname,
            state: {
                openFilter: true,
            },
        });
    };

    const getOrders = useCallback(async () => {
        setLoading(true);
        const searchClient = algoliasearch(
            ALGOLIA_CONFIG.appId,
            ALGOLIA_CONFIG.apiKey
        );
        const index = searchClient.initIndex("orders");
        let filterArr: Array<string[]> = [];

        if (!user.admin) {
            filterArr = [[`orgId:${user.orgId}`]];
        }

        if (orderType) {
            filterArr = [
                ...filterArr,
                [`orderType.${orderType}.isActive:true`],
            ];
        }

        filterArr = [
            ...filterArr,
            ...generateOrderStateFilterQuery(filters, orderType!),
        ];

        index
            .search(searchQuery, {
                facetFilters: filterArr,
                hitsPerPage: rowsPerPage,
                page,
            })
            .then(({ hits, nbHits }) => {
                setTotalOrders(nbHits); // This will set the total orders for the respective filter
                setOrders(hits as Order[]);
                setApiError(false);
            })
            .catch(() => setApiError(true))
            .finally(() => {
                setLoading(false);
            });
    }, [user, searchQuery, filters, page, rowsPerPage, orderType]);

    useEffect(() => {
        getOrders();
    }, [getOrders]);

    if (!orderType) {
        return <Redirect to="/" />;
    }

    const onRefresh = () => {
        getOrders();
    };

    if (apiError)
        return (
            <Box
                width="100%"
                alignItems="center"
                display="flex"
                justifyContent="center"
                height="100%"
            >
                <Alert
                    severity="error"
                    action={
                        <Button
                            onClick={onRefresh}
                            color="inherit"
                            size="small"
                        >
                            Refresh
                        </Button>
                    }
                >
                    <AlertTitle>Error</AlertTitle>
                    We encountered an error, please try again later
                </Alert>
            </Box>
        );

    return (
        <>
            <Grid container direction="column" spacing={3}>
                <Grid item xs={12}>
                    <TopBar
                        {...{ searchQuery }}
                        {...{ setSearchQuery }}
                        {...{ filters }}
                        {...{ onRefresh }}
                        {...{ onFilterOpen }}
                    />
                </Grid>
                <Grid item xs={12}>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <OrderTable
                            {...{ orders }}
                            {...{ page }}
                            {...{ totalOrders }}
                            {...{ rowsPerPage }}
                            {...{ setRowsPerPage }}
                            {...{ setPage }}
                        />
                    )}
                </Grid>
            </Grid>
            <Filters
                open={openFilter}
                onClose={onFilterClose}
                {...{ setFilters }}
                {...{ filters }}
            />
        </>
    );
};
