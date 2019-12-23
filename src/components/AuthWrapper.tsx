import React from 'react';
import {
    Container, 
    CssBaseline,
    makeStyles,
    Toolbar
} from '@material-ui/core';

interface Props {
    children: JSX.Element
}

export const AuthWrapper: React.FC<Props> = ({children}) => {

    const classes = useStyles();
    return (
        <>
            <CssBaseline />
            <Container maxWidth="sm">
                <Toolbar />
                <div className={classes.root}>
                    {children}
                </div>
            </Container>
        </>
    )
}

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        justifyContent: "center"
    }
}))