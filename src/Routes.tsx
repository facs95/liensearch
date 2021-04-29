import React, { useContext } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { Login, Dashboard, CreateAccount, NewOrder } from "./views";
import { UserContext } from "./context/UserContext";
import { AuthWrapper, AppWrapper } from "./components";
import { OrderInfo } from "./views/OrderInfo";
import { ForgotPassword } from "./views/auth/ForgotPassword";
import { AppWrapperParams } from "./components/AppWrapper";
import { ManageClients } from "./views/admin/ManageClients";
import { ManageEmployees } from "./views/admin/ManageEmployees";
import { UserProfile } from "./views/UserProfile";
import { Orders } from "./views/orders/Orders";

const authWrap = (component: JSX.Element): JSX.Element => (
    <AuthWrapper>{component}</AuthWrapper>
);
const appWrap = (
    component: JSX.Element,
    options?: AppWrapperParams
): JSX.Element => <AppWrapper {...options}>{component}</AppWrapper>;

export interface RouterParams {
    id: string;
}

export const Routes: React.FC = () => {
    const currentUser = useContext(UserContext);

    if (currentUser?.uid) {
        return (
            <Switch>
                <Route exact path="/" render={() => appWrap(<Dashboard />)} />
                <Route
                    exact
                    path="/:orderType"
                    render={() => appWrap(<Orders />)}
                />
                <Route
                    exact
                    path="/new-order/:step"
                    render={() => appWrap(<NewOrder />)}
                />
                <Route
                    exact
                    path="/update/:id/:step"
                    render={() => appWrap(<NewOrder />)}
                />
                <Route
                    exact
                    path="/order/:id"
                    render={() => appWrap(<OrderInfo />)}
                />
                <Route
                    exact
                    path="/profile"
                    render={() =>
                        appWrap(<UserProfile />, { noBreadCrumb: true })
                    }
                />
                {currentUser.admin && (
                    <>
                        <Route
                            exact
                            path="/admin/employees"
                            render={() =>
                                appWrap(<ManageEmployees />, {
                                    noBreadCrumb: true,
                                })
                            }
                        />
                        <Route
                            exact
                            path="/admin/clients"
                            render={() =>
                                appWrap(<ManageClients />, {
                                    noBreadCrumb: true,
                                })
                            }
                        />
                    </>
                )}
                <Redirect to="/" />
            </Switch>
        );
    } else {
        return (
            <Switch>
                <Route exact path="/" render={() => authWrap(<Login />)} />
                <Route
                    exact
                    path="/create-account"
                    render={() => authWrap(<CreateAccount />)}
                />
                <Route
                    exact
                    path="/forgot-password"
                    render={() => authWrap(<ForgotPassword />)}
                />
                <Redirect to="/" />
            </Switch>
        );
    }
};
