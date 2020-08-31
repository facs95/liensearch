import React, { useContext } from "react";
import { Grid, Typography, Button, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { UserContext } from "../context/UserContext";

import { OrdersTable } from "../components/OrdersTable";

export const Dashboard: React.FC = () => {
    const history = useHistory();

    const user = useContext(UserContext);

    const classes = useStyles();

    const isAdmin = user?.admin;

    return (
        <Grid
            item
            container
            direction="column"
            spacing={5}
            className={classes.container}
        >
            <Grid
                item
                container
                wrap="nowrap"
                justify="space-between"
                alignItems="center"
            >
                <Grid item>
                    <Typography variant="h5">Orders</Typography>
                </Grid>
                {!isAdmin && (
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => history.push("/new-order/1")}
                        >
                            New Order
                        </Button>
                    </Grid>
                )}
            </Grid>
            <Grid item container spacing={3} direction="column">
                <Grid item>
                    <OrdersTable />
                </Grid>
            </Grid>
        </Grid>
    );
};

const useStyles = makeStyles(() => ({
    container: {
        width: "80vw",
    },
    pointer: {
        cursor: "pointer",
    },
}));
