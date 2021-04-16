import { Box, Chip, Typography } from "@material-ui/core";
import React from "react";

interface Props {
    orgName: string;
}
export const OrganizationHeader = ({ orgName }: Props) => {
    return (
        <Box display="flex" alignItems="center" flexWrap="nowrap">
            <Box mr={1}>
                <Typography variant="h6">Organization:</Typography>
            </Box>
            <Chip
                label={<Typography variant="h6">{orgName}</Typography>}
            />
        </Box>
    );
};
