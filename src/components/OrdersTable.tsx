import React, {
    useEffect,
    useState,
    useCallback,
    useContext,
    useMemo,
} from "react";
import { Grid } from "@material-ui/core";

import algoliasearch from "algoliasearch/lite";
import { OrderTable } from "./OrderTable";
import { Order, orderStatusEnumKeys, orderTypeEnumKeys } from "../Interfaces";
import { UserContext } from "../context/UserContext";
import { SearchInput } from "./SearchInput";
import { FilterOptions, Filters } from "./Filters";
import { transform } from "lodash";
import { EmptyState } from "./EmpyState";

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
            });
    }, [user, searchQuery, filters]);

    useEffect(() => {
        getOrders();
    }, [getOrders]);

    return (
        <Grid container direction="column" spacing={4}>
            <Grid item container direction="column" spacing={2}>
                <Grid item container>
                    <Filters {...{ filters }} />
                </Grid>
                <Grid item>
                    <SearchInput
                        value={searchQuery}
                        setValue={setSearchQuery}
                    />
                </Grid>
            </Grid>
            <Grid item>
                {orders.length === 0 ? (
                    <EmptyState title="No Orders Found" imageFile="orders.svg" />
                ) : (
                    <OrderTable {...{ orders }} />
                )}
            </Grid>
        </Grid>
    );
};
