import React, { useContext, useEffect } from "react";
import { Grid, Button, makeStyles, Breadcrumbs, Link } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { UserContext } from "../context/UserContext";

import { OrdersTable } from "../components/OrdersTable";
import { TitleContext } from "../context/TitleContext";

export const Dashboard: React.FC = () => {
    const history = useHistory();

    const user = useContext(UserContext);
    const { setTitle } = useContext(TitleContext);

    useEffect(() => {
        setTitle("Dashboard");
    }, [setTitle]);

    const classes = useStyles();

    const isAdmin = user?.admin;

    return <OrdersTable />;
};

const useStyles = makeStyles(() => ({
    container: {},
    pointer: {
        cursor: "pointer",
    },
}));
