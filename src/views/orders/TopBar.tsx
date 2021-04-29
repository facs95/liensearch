import { Badge, Box, Button } from "@material-ui/core";
import React from "react";
import { SearchInput } from "../../components/SearchInput";
import RefreshIcon from "@material-ui/icons/Refresh";
import FilterListIcon from "@material-ui/icons/FilterList";
import { OrderStateFilterInterface } from "./Filters";

interface Props {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    onRefresh: () => void;
    onFilterOpen: () => void;
    filters: OrderStateFilterInterface;
}
export const TopBar = ({
    searchQuery,
    setSearchQuery,
    onRefresh,
    onFilterOpen,
    filters,
}: Props) => {
    return (
        <Box display="flex" justifyContent="space-between" width="100%">
            <SearchInput value={searchQuery} setValue={setSearchQuery} />
            <Box display="flex" flexWrap="nowrap">
                <Box mr={1}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<RefreshIcon />}
                        onClick={onRefresh}
                    >
                        Refresh
                    </Button>
                </Box>
                <Badge
                    color="error"
                    variant="dot"
                    invisible={
                        !filters.organizations &&
                        !filters.employee &&
                        !Object.values(filters.orderState).find(
                            (state) => state
                        )
                    }
                >
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<FilterListIcon />}
                        onClick={onFilterOpen}
                    >
                        Filter
                    </Button>
                </Badge>
            </Box>
        </Box>
    );
};
