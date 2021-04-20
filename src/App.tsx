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
import { SnackContext } from "./context/SnackContext";
import { MessageSnackbar } from "./components/SnackMessage";

const history = createBrowserHistory();

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#fff200",
        },
        secondary: {
            main: "#e32c2c",
        },
    },
    typography: {
        fontSize: 13
    },
    spacing: 6,
    overrides: {
        MuiButton: {
            root: {
                height: 40,
            },
        },
        MuiFormLabel: {
            root: {
                "&$focused": {
                    borderColor: "black",
                },
            },
        },
        MuiTextField: {
            root: {
                "&.Mui-focused fieldset": {
                    borderColor: "green",
                },
            },
        },
        MuiOutlinedInput: {
            root: {
                "&$focused": {
                    borderColor: "black",
                },
            },
        },
    },
});

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [messageType, setMessageType] = useState<"success" | "error">(
        "error"
    );
    const [message, setMessage] = useState("");

    const db = firebase.firestore();

    useEffect(() => {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const token = await user.getIdTokenResult();
                    let userDoc;
                    if (token.claims.admin) {
                        userDoc = await db
                            .collection("employees")
                            .doc(user.uid)
                            .get();
                    } else {
                        userDoc = await db
                            .collection("users")
                            .doc(user.uid)
                            .get();
                    }
                    let userData;
                    if (userDoc.exists) {
                        userData = userDoc.data();
                    }
                    setCurrentUser({
                        admin: token.claims.admin ?? false,
                        orgId: userData?.orgId ?? "",
                        name: userData?.name ?? "",
                        phoneNumber: userData?.phoneNumber ?? "",
                        email: user.email || "",
                        uid: user.uid || "",
                    });
                } catch (err) {
                    console.log(err);
                } finally {
                    setLoading(false);
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
                <SnackContext.Provider value={{ setMessage, setMessageType }}>
                    <MessageSnackbar
                        {...{ message }}
                        {...{ setMessage }}
                        {...{ messageType }}
                    />
                    <Router history={history}>
                        <Switch>
                            <Routes />
                        </Switch>
                    </Router>
                </SnackContext.Provider>
            </UserContext.Provider>
        </ThemeProvider>
    );
};

export default App;
