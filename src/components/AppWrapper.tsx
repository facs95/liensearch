import React, { useState } from "react";
import {
    Toolbar,
    Grid,
    makeStyles,
    LinearProgress,
    CssBaseline,
} from "@material-ui/core";

import { AppHeader } from "./AppHeader";
import { LoadingContext } from "../context/LoadingContext";
import { LeftNav } from "./LeftNav/LeftNav";
import { TitleContext } from "../context/TitleContext";
import { NavigationBar } from "./NavigationBar";
import {
    ActionButtonInterface,
    ActionButtonContext,
} from "../context/ActionButtonContext";
import { MessageSnackbar } from "./SnackMessage";
import { SnackContext } from "../context/SnackContext";

interface Props {
    children: JSX.Element;
}

export const DRAWER_WIDTH = 240;

export const AppWrapper: React.FC<Props> = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">(
        "error"
    );
    const [title, setTitle] = useState("");
    const [
        actionButton,
        setActionButton,
    ] = useState<ActionButtonInterface | null>(null);

    const classes = useStyles();

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            <TitleContext.Provider value={{ title, setTitle }}>
                <ActionButtonContext.Provider
                    value={{ actionButton, setActionButton }}
                >
                    <SnackContext.Provider
                        value={{ setMessage, setMessageType }}
                    >
                        <MessageSnackbar
                            {...{ message }}
                            {...{ setMessage }}
                            {...{ messageType }}
                        />
                        <div className={classes.root}>
                            <CssBaseline />
                            <AppHeader />
                            <LeftNav />
                            {loading && <LinearProgress />}
                            <main className={classes.content}>
                                <Toolbar />
                                <div className={classes.bottomMargin}>
                                    <NavigationBar />
                                </div>
                                {children}
                            </main>
                        </div>
                    </SnackContext.Provider>
                </ActionButtonContext.Provider>
            </TitleContext.Provider>
        </LoadingContext.Provider>
    );
};

const useStyles = makeStyles((theme) => ({
    content: {
        paddingTop: 20,
        paddingLeft: 100,
        paddingRight: 100,
        width: "100%",
    },
    root: {
        display: "flex",
    },
    bottomMargin: {
        marginBottom: theme.spacing(4),
    },
}));
