import React from 'react';
import {
    Container, 
    CssBaseline,
    makeStyles
} from '@material-ui/core';

import {AppHeader} from './AppHeader';

interface Props {
    children: JSX.Element
}

export const AppWrapper: React.FC<Props> = ({children}) => {

    const classes = useStyles();
    return (
        <>
            <CssBaseline />
            <AppHeader />
            <Container maxWidth="sm">
                <div className={classes.root}>
                    {children}
                </div>
            </Container>
        </>
    )
}

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: "center",
        marginTop: theme.spacing(5)
    }
}))