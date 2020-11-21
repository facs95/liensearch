import { Breadcrumbs, Button, Grid, Link, makeStyles } from "@material-ui/core";
import React, { useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { RouterParams } from "../Routes";
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import { ActionButtonContext } from "../context/ActionButtonContext";

export const NavigationBar = () => {
    const { id } = useParams<RouterParams>();

    const classes = useStyles();

    const {actionButton} = useContext(ActionButtonContext);

    const history = useHistory();

    return (
        <Grid container justify="space-between" alignItems="center">
            <Grid item>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link
                        color="inherit"
                        onClick={() => history.push("/")}
                        className={classes.pointer}
                    >
                        All
                    </Link>
                    {id && (
                        <Link
                            color="inherit"
                            className={classes.link}
                        >
                            <LibraryBooksIcon className={classes.icon} />       
                            {id}
                        </Link>
                    )}
                </Breadcrumbs>
            </Grid>
            {actionButton && (
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={actionButton.action}
                    >
                        {actionButton.label}
                    </Button>
                </Grid>
            )}
        </Grid>
    );
};

const useStyles = makeStyles(theme => ({
    pointer: {
        cursor: "pointer",
    },
    link: {
        display: 'flex'
    },
    icon: {
        marginRight: theme.spacing(1)
    }
}));
