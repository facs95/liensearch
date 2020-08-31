import React, { useState, useEffect } from "react";
import { Switch, Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { Routes } from "./Routes";
import { UserContext } from "./context/UserContext";
import firebase from "firebase/app";
import "./initFirebase";
import { User } from "./Interfaces";

const history = createBrowserHistory();

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#fff200'
        }
    }
});

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const db = firebase.firestore();

    useEffect(() => {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const token = await user.getIdTokenResult();
                    const userDoc = await db.collection('users').doc(user.uid).get();
                    let userData;
                    if (userDoc.exists) {
                        userData = await userDoc.data();
                    }
                    setCurrentUser({
                        admin: token.claims.admin ?? false,
                        orgId: userData?.orgId ?? '',
                        name: userData?.name ?? '',
                        phoneNumber: userData?.phoneNumber ?? '',
                        email: user.email || '',
                        uid: user.uid || ''
                    });
                } catch (err) {
                    console.log(err);
                } finally {
                    setLoading(false)
                }
            } else {
                setCurrentUser(null);
                setLoading(false);
            }
        });
    }, [db]);

    if (loading) return <></>;

    return (
        <ThemeProvider theme={theme}>
            <UserContext.Provider value={currentUser}>
                <Router history={history}>
                    <Switch>
                        <Routes />
                    </Switch>
                </Router>
            </UserContext.Provider>
        </ThemeProvider>
    );
};

export default App;
