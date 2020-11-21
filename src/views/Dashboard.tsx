import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../context/UserContext";

import { OrdersTable } from "../components/OrdersTable";
import { TitleContext } from "../context/TitleContext";
import { ActionButtonContext } from "../context/ActionButtonContext";

export const Dashboard: React.FC = () => {
    const history = useHistory();

    const user = useContext(UserContext);
    const { setTitle } = useContext(TitleContext);
    const {setActionButton} = useContext(ActionButtonContext);

    useEffect(() => {
        setTitle("Dashboard");
    }, [setTitle]);


    useEffect(() => {
        if (!user?.admin) {
            setActionButton({
                label: 'New Order',
                action: () => history.push("/new-order/1")
            })
        }
        return () => {
            setActionButton(null)
        }
    }, [user, setActionButton, history])

    return <OrdersTable />;
};

