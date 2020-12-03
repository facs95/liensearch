import React from "react";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { makeStyles } from "@material-ui/core";

interface Props {
    isActive: boolean;
}

export const ActiveIcon = ({ isActive }: Props) => {
    const classes = useStyles();
    return isActive ? (
        <CheckCircleIcon className={classes.active} />
    ) : (
        <CancelIcon className={classes.inactive} />
    );
};

const useStyles = makeStyles((theme) => ({
    active: {
        color: theme.palette.success.main,
        display: 'flex',
        alignSelf: 'center'
    },
    inactive: {
        color: theme.palette.error.main,
        display: 'flex',
        alignSelf: 'center'
    },
}));
