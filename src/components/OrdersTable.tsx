import React, {
    useEffect,
    useState,
    useCallback,
    useContext,
    useMemo,
} from "react";
import { Badge, Grid, IconButton } from "@material-ui/core";

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

export const OrdersTable = () => {
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

    const getOrders = useCallback(async () => {
        const searchClient = algoliasearch(
            "1AVZX9L93I",
            "68be777ac13a6002caf326d9bcfbf90a"
        );
        const index = await searchClient.initIndex("orders");

        let filterArr: Array<string[]> = [];

        if (user && !user?.admin) {
            filterArr = [[`orgId:${user.orgId}`]];
        }

        filterArr = generateFilterQuery(filters, filterArr);
        index
            .search(searchQuery, {
                facetFilters: filterArr,
            })
            .then(({ hits }) => {
                setOrders(hits as Order[]);
            })
            .catch((err) => console.log(err));
    }, [user, searchQuery, filters]);

    const onRefresh = () => {
        getOrders();
    };

    useEffect(() => {
        getOrders();
    }, [getOrders]);

    return (
        <>
            <FilterDrawer
                open={openFilter}
                onClose={onFilterClose}
                {...{ filters }}
            />
            <Grid container direction="column" spacing={4}>
                <Grid
                    item
                    container
                    justify="space-between"
                    spacing={2}
                    wrap="nowrap"
                >
                    <Grid item xs={10}>
                        <SearchInput
                            value={searchQuery}
                            setValue={setSearchQuery}
                        />
                    </Grid>
                    <Grid item container spacing={1} justify="flex-end">
                        <Grid item>
                            <IconButton size="small" onClick={onRefresh}>
                                <RefreshIcon />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton size="small" onClick={onFilterOpen}>
                                <Badge
                                    color="error"
                                    variant="dot"
                                    invisible={
                                        !Object.values(filters).find(
                                            (type) => !!type.value
                                        )
                                    }
                                >
                                    <FilterListIcon />
                                </Badge>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    {orders.length === 0 ? (
                        <EmptyState
                            title="No Orders Found"
                            imageFile="orders.svg"
                        />
                    ) : (
                        <OrderTable {...{ orders }} />
                    )}
                </Grid>
            </Grid>
        </>
    );
};
