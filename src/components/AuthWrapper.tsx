import React from "react";
import { makeStyles, CssBaseline } from "@material-ui/core";

interface Props {
    children: JSX.Element;
}

export const AuthWrapper: React.FC<Props> = ({ children }) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <CssBaseline />
            {children}
        </div>
    );
};

const useStyles = makeStyles(theme=> ({
    root: {
        height: '100vh',
        backgroundColor: theme.palette.primary.main,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
}));
