import React, { useState } from "react";
import {
    Toolbar,
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

export interface AppWrapperParams {
    noPadding?: boolean;
    noBreadCrumb?: boolean;
}
interface Props extends AppWrapperParams {
    children: JSX.Element;
}

export const DRAWER_WIDTH = 240;

export const AppWrapper: React.FC<Props> = ({
    children,
    noBreadCrumb,
    noPadding,
}) => {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [
        actionButton,
        setNavigationBar,
    ] = useState<ActionButtonInterface | null>(null);

    const classes = useStyles();

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            <TitleContext.Provider value={{ title, setTitle }}>
                <ActionButtonContext.Provider
                    value={{ actionButton, setNavigationBar }}
                >
                    <div className={classes.root}>
                        <CssBaseline />
                        <AppHeader />
                        <LeftNav />
                        {loading && <LinearProgress />}
                        <main
                            className={`${classes.content} ${
                                !noPadding ? classes.paddingContent : undefined
                            }`}
                        >
                            <Toolbar />
                            {!noBreadCrumb && (
                                <div className={classes.bottomMargin}>
                                    <NavigationBar />
                                </div>
                            )}
                            {children}
                        </main>
                    </div>
                </ActionButtonContext.Provider>
            </TitleContext.Provider>
        </LoadingContext.Provider>
    );
};

const useStyles = makeStyles((theme) => ({
    content: {
        paddingTop: 20,
        width: "100%",
    },
    paddingContent: {
        paddingLeft: 100,
        paddingRight: 100,
    },
    root: {
        display: "flex",
    },
    bottomMargin: {
        marginBottom: theme.spacing(4),
    },
}));
