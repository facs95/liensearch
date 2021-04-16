import React, {
    useEffect,
    useState,
    useCallback,
    useContext,
    useMemo,
} from "react";
import {
    Badge,
    Box,
    Button,
    CircularProgress,
    Grid,
    IconButton,
} from "@material-ui/core";

import algoliasearch from "algoliasearch/lite";
import { OrderTable } from "./OrderTable";
import { Order, orderTypeEnumKeys, orderStatusEnumKeys } from "../Interfaces";
import { UserContext } from "../context/UserContext";
import { SearchInput } from "./SearchInput";
import { FilterOptions } from "./Filters";
import { transform } from "lodash";
import { EmptyState } from "./EmpyState";
import FilterListIcon from "@material-ui/icons/FilterList";
import { useHistory, useLocation } from "react-router-dom";
import { FilterDrawer } from "./FilterDrawer";
import RefreshIcon from "@material-ui/icons/Refresh";
import { ALGOLIA_CONFIG } from "../config";
import { Alert, AlertTitle } from "@material-ui/lab";
import firebase from "firebase/app";

//This two have to be always in order
//To add a new filter it has to be added in algolia
const getFilter: Map<
    keyof FilterOptions,
    (value: string) => string[]
> = new Map([
    ["organizations", (value: string) => [`orgId:${value}`]],
    ["orderType", (value: string) => [`orderType.${value}.isActive:true`]],
    ["status", (value: string) => [`status:${value}`]],
    [
        "employee",
        (value: string) => [
            `orderType.lienSearch.assignee:${value}`,
            `orderType.landSurvey.assignee:${value}`,
            `orderType.permitResolution.assignee:${value}`,
            `orderType.estoppelLetter.assignee:${value}`,
        ],
    ],
]);

const generateFilterQuery = (
    filters: FilterOptions,
    initialValue?: Array<string[]>
) => {
    return transform(
        { ...filters },
        (acc, value, key) => {
            if (value?.value) {
                return acc.push(
                    getFilter.get(key as keyof FilterOptions)!(value.value)
                );
            }
            return acc;
        },
        initialValue || []
    );
};

export const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<orderStatusEnumKeys | "">(
        ""
    );
    const [filterOrg, setFilterOrg] = useState("");
    const [filterEmployee, setFilterEmployee] = useState("");
    const [filterOrderType, setFilterOrderType] = useState<
        orderTypeEnumKeys | ""
    >("");
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(false);
    const [totalOrders, setTotalOrders] = useState<number>(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const user = useContext(UserContext);

    const history = useHistory();
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

    const filters = useMemo(() => {
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

        if (user?.admin) {
            filtersOptions.organizations = {
                value: filterOrg,
                setter: setFilterOrg,
            };
            filtersOptions.employee = {
                value: filterEmployee,
                setter: setFilterEmployee,
            };
        }
        return filtersOptions;
    }, [user, filterStatus, filterOrderType, filterOrg, filterEmployee]);

    const setTotalCount = useCallback(async () => {
        const db = firebase.firestore();
        if (user && !user?.admin) {
            const orgStats = await db
                .collection("organizations")
                .doc(user.orgId)
                .get();
            if (orgStats.exists) {
                const statsData = orgStats.data();
                setTotalOrders(statsData ? statsData.orderCount : 0);
            } else {
                setTotalOrders(0);
            }
        } else {
            const ordersStats = await db
                .collection("stats")
                .doc("orders")
                .get();
            if (ordersStats.exists) {
                const statsData = ordersStats.data();
                setTotalOrders(statsData ? statsData.count : 0);
            } else {
                setTotalOrders(0);
            }
        }
    }, [user]);

    const getOrders = useCallback(async () => {
        const searchClient = algoliasearch(
            ALGOLIA_CONFIG.appId,
            ALGOLIA_CONFIG.apiKey
        );
        const index = searchClient.initIndex("orders");

        let filterArr: Array<string[]> = [];

        if (user && !user?.admin) {
            filterArr = [[`orgId:${user.orgId}`]];
        }

        filterArr = generateFilterQuery(filters, filterArr);
        index
            .search(searchQuery, {
                facetFilters: filterArr,
                hitsPerPage: rowsPerPage,
                page,
            })
            .then(({ hits }) => {
                console.log(hits);
                setOrders(hits as Order[]);
                setApiError(false);
            })
            .catch((err) => setApiError(true))
            .finally(() => {
                setLoading(false);
            });
    }, [user, searchQuery, filters, page, rowsPerPage]);

    const onRefresh = () => {
        getOrders();
        setTotalCount();
    };

    useEffect(() => {
        getOrders();
        setTotalCount();
    }, [getOrders, setTotalCount]);

    if (loading) return <CircularProgress />;

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
        <Grid container direction="column" spacing={4}>
            <FilterDrawer
                open={openFilter}
                onClose={onFilterClose}
                {...{ filters }}
            />
            <Grid
                item
                container
                justify="space-between"
                spacing={2}
                wrap="nowrap"
                alignItems="center"
            >
                <Grid item xs={10}>
                    <SearchInput
                        value={searchQuery}
                        setValue={setSearchQuery}
                    />
                </Grid>
                <Grid item container spacing={1} justify="flex-end">
                    <Grid item>
                        <Button
                            variant="text"
                            size="small"
                            startIcon={<RefreshIcon />}
                            onClick={onRefresh}
                        >
                            Refresh
                        </Button>
                    </Grid>
                    <Grid item>
                        <Badge
                            color="error"
                            variant="dot"
                            invisible={
                                !Object.values(filters).find(
                                    (type) => !!type.value
                                )
                            }
                        >
                            <Button
                                variant="text"
                                size="small"
                                startIcon={<FilterListIcon />}
                                onClick={onFilterOpen}
                            >
                                Filter
                            </Button>
                        </Badge>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                {orders.length === 0 ? (
                    <EmptyState
                        title="No Orders Found"
                        imageFile="orders.svg"
                    />
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
    );
};
