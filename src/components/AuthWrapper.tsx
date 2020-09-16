import React from "react";
import { Container, makeStyles, Toolbar, CssBaseline } from "@material-ui/core";

interface Props {
    children: JSX.Element;
}

export const AuthWrapper: React.FC<Props> = ({ children }) => {
    const classes = useStyles();
    return (
        <>
            <CssBaseline />
            <img
                alt=""
                className={classes.logo}
                src={`${process.env.PUBLIC_URL}/logo.png`}
            />
            <Container maxWidth="sm">
                <Toolbar />
                {children}
            </Container>
        </>
    );
};

const useStyles = makeStyles(() => ({
    logo: {
        height: 120,
    },
}));
