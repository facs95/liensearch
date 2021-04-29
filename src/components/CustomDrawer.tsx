import {
    Drawer,
    Grid,
    IconButton,
    makeStyles,
    Typography,
} from "@material-ui/core";
import React from "react";
import CloseIcon from "@material-ui/icons/Close";

export interface CustomDrawerProps {
    open: boolean;
    onClose: () => void;
    header: string;
    content: JSX.Element;
}

const DRAWER_WIDTH = 400;

export const CustomDrawer = ({
    open,
    onClose,
    content,
    header,
}: CustomDrawerProps) => {
    const classes = useStyles();

    const container = (
        <Grid
            container
            direction="column"
            className={classes.container}
            spacing={2}
        >
            <Grid container item justify="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h5">
                        {header ? header : "Modify Order"}
                    </Typography>
                </Grid>
                <Grid item>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </Grid>
            <Grid item>{content}</Grid>
        </Grid>
    );
    return (
        <Drawer anchor="right" {...{ open }} {...{ onClose }}>
            {container}
        </Drawer>
    );
};

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(2, 5),
        width: DRAWER_WIDTH,
    },
}));
