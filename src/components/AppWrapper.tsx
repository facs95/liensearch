import React, { useContext, useState } from 'react';
import {
    Toolbar,
    Grid,
    makeStyles,
    LinearProgress,
} from '@material-ui/core';

import {AppHeader} from './AppHeader';
import { LoadingContext } from '../context/LoadingContext';

interface Props {
    children: JSX.Element
}

export const AppWrapper: React.FC<Props> = ({children}) => {

    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    return (
        <>
            <AppHeader />
            <Toolbar />
            {loading && <LinearProgress />}
            <LoadingContext.Provider value={{loading, setLoading}}>
                <Grid container direction="column" alignItems="center" spacing={3} className={classes.content}>
                    {children}
                </Grid>
            </LoadingContext.Provider>
        </>
    )
}

const useStyles = makeStyles(theme => ({
    content: {
        padding: theme.spacing(3, 4, 6, 4),
        wordBreak: 'break-word',
        minWidth: 0
    }
}))
