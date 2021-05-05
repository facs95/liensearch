import { FilterOptions } from "../components/Filters";
import { transform } from "lodash";
import { OrderStateFilterInterface } from "../views/orders/Filters";
import { orderTypeEnumKeys } from "../Interfaces";

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

export const generateOrderStateFilterQuery = (
    filters: OrderStateFilterInterface,
    orderState: orderTypeEnumKeys
) => {
    let query: string[][] = [];
    if (filters.organizations) {
        const filter = [`orgId:${filters.organizations}`];
        query = [filter];
    }
    if (filters.employee) {
        const filter = [`orderType.${orderState}.assignee:${filters.employee}`];
        query = [...query, filter];
    }
    if (filters.orderState) {
        const filter = transform<boolean, string[]>(
            filters.orderState,
            (acc, value, key) => {
                if (value) {
                    //This will be a boolean
                    acc.push(`orderType.${orderState}.status:${key}`);
                }
            },
            []
        );
        query = [...query, filter];
    }
    return query;
};

export const generateFilterQuery = (
    filters: FilterOptions,
    initialValue: Array<string[]>
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
        initialValue
    );
};
