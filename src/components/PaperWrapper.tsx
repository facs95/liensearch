import React from 'react';
import { Paper, makeStyles } from '@material-ui/core';

interface Props {
    children: JSX.Element
}

export const PaperWrapper = ({children}: Props) => {

    const classes = useStyles();

    return (
        <Paper className={classes.padding}>
            {children}
        </Paper>
    )
}

const useStyles = makeStyles(theme => ({
    padding: {
        padding: theme.spacing(5),
        width: 500
    }
}))