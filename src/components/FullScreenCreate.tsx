import React from 'react';
import { Dialog, Grid, AppBar, Toolbar, IconButton, Typography, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useHistory } from 'react-router-dom';
import { CreateStepper } from './CreateStepper';

interface Props {
    toolbarHeader: string,
    cancelPath: string,
    activeStep: string,
    stepComponents: Array<{
        label: string,
        component: JSX.Element,
    }>
}

export const FullScreenCreate = ({activeStep, toolbarHeader, cancelPath, stepComponents}: Props) => {

    const history = useHistory();
    const classes = useStyles();
    
    const createStep = parseInt(activeStep) - 1;

    const onClose = () => history.push(cancelPath);

    return (
        <Dialog fullScreen open={true} onClose={onClose}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <Typography variant="h5">
                                {toolbarHeader}
                            </Typography>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Grid container direction="column">
                <Grid container item justify="center">
                    <CreateStepper activeStep={createStep} steps={stepComponents} />
                </Grid>
                <Grid item container justify="center">
                    {stepComponents[createStep]?.component ?? 'Error'}
                </Grid>
            </Grid>
        </Dialog>
    )
}

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative'
    },
    paper: {
        padding: theme.spacing(4, 5, 2, 5)
    },
    buttons: {
        marginBottom: theme.spacing(2)
    }
}))