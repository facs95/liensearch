import React, {
    useEffect,
    useState,
    useCallback,
    useContext,
    useMemo,
} from "react";
import { Grid, IconButton } from "@material-ui/core";

import algoliasearch from "algoliasearch/lite";
import { OrderTable } from "./OrderTable";
import { Order, orderStatusEnumKeys, orderTypeEnumKeys } from "../Interfaces";
import { UserContext } from "../context/UserContext";
import { SearchInput } from "./SearchInput";
import { FilterOptions } from "./Filters";
import { transform } from "lodash";
import { EmptyState } from "./EmpyState";
import FilterListIcon from "@material-ui/icons/FilterList";
import { useHistory, useLocation } from "react-router-dom";
import { FilterDrawer } from "./FilterDrawer";

const searchClient = algoliasearch(
    "1AVZX9L93I",
    "68be777ac13a6002caf326d9bcfbf90a"
);

//This two have to be always in order

const getFilter: Map<keyof FilterOptions, (value: string) => string> = new Map([
    ["organizations", (value: string) => `orgId:${value}`],
    ["orderType", (value: string) => `orderType.${value}:true`],
    ["status", (value: string) => `status:${value}`],
]);

const generateFilterQuery = (
    filters: FilterOptions,
    initialValue?: string[]
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

        if (user?.admin)
            filtersOptions.organizations = {
                value: filterOrg,
                setter: setFilterOrg,
            };
        return filtersOptions;
    }, [user, filterStatus, filterOrderType, filterOrg]);

    const getOrders = useCallback(async () => {
        const index = await searchClient.initIndex("orders");

        let filterArr: string[] = [];

        if (user && !user?.admin) {
            filterArr = [`orgId:${user.orgId}`];
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
                <Grid item container justify="space-between" spacing={2}>
                    <Grid item xs={10}>
                        <SearchInput
                            value={searchQuery}
                            setValue={setSearchQuery}
                        />
                    </Grid>
                    <Grid item>
                        <IconButton size="small" onClick={onFilterOpen}>
                            <FilterListIcon />
                        </IconButton>
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
