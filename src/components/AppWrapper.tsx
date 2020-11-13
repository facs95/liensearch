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

interface Props {
    children: JSX.Element;
}

export const DRAWER_WIDTH = 240;

export const AppWrapper: React.FC<Props> = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");

    const classes = useStyles();

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            <TitleContext.Provider value={{ title, setTitle }}>
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
        marginBottom: theme.spacing(4)
    },
}));
