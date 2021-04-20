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
    noBreadCrumb?: boolean;
}
interface Props extends AppWrapperParams {
    children: JSX.Element;
}

export const DRAWER_WIDTH = 240;

export const AppWrapper: React.FC<Props> = ({ children, noBreadCrumb }) => {
    const [title, setTitle] = useState("");
    const [
        actionButton,
        setNavigationBar,
    ] = useState<ActionButtonInterface | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const classes = useStyles();

    return (
        <TitleContext.Provider value={{ title, setTitle }}>
            <ActionButtonContext.Provider
                value={{ actionButton, setNavigationBar }}
            >
                <div className={classes.root}>
                    <CssBaseline />
                    <LeftNav {...{ drawerOpen }} {...{ setDrawerOpen }} />
                    <div className={classes.container}>
                        <AppHeader {...{ setDrawerOpen }} />
                        <main className={classes.content}>
                            {!noBreadCrumb && (
                                <div className={classes.bottomMargin}>
                                    <NavigationBar />
                                </div>
                            )}
                            {children}
                        </main>
                    </div>
                </div>
            </ActionButtonContext.Provider>
        </TitleContext.Provider>
    );
};

const useStyles = makeStyles((theme) => ({
    content: {
        width: "100%",
    },
    root: {
        display: "flex",
    },
    bottomMargin: {
        marginBottom: theme.spacing(4),
    },
    container: {
        display: "flex",
        flexDirection: "column",
        padding: theme.spacing(2, 5),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: `calc(100% - ${DRAWER_WIDTH}px)`,
        },
    },
}));
