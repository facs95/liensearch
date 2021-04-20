import { Box, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { OrderStatusEnum, orderStatusEnumKeys } from "../Interfaces";

type size = 'small' | 'big'

interface Props {
    status: orderStatusEnumKeys;
    size?: size
}

export const StatusChip = ({ status, size = 'big' }: Props) => {
    const classes = useStyles(size)();

    return (
        <Box className={`${classes.container} ${classes[status]}`}>
            <Typography>{OrderStatusEnum[status]}</Typography>
        </Box>
    );
};

const useStyles = (size: size) => makeStyles((theme) => ({
    inProgress: {
        backgroundColor: theme.palette.info.main,
    },
    finalized: {
        backgroundColor: theme.palette.success.main,
    },
    cancelled: {
        backgroundColor: theme.palette.error.main,
    },
    hold: {
        backgroundColor: theme.palette.warning.main,
    },
    container: {
        padding: size === 'small' ? theme.spacing(0.5, 1) : theme.spacing(1, 2),
        borderRadius: theme.shape.borderRadius,
        color: "white",
        display: 'inline-block',
        minWidth: 100,
        textAlign: 'center'
    },
}));
