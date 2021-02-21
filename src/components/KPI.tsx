import {
    Grid,
    IconButton,
    makeStyles,
    Paper,
    Typography,
} from "@material-ui/core";
import React, { isValidElement } from "react";
import EditRoundedIcon from "@material-ui/icons/EditRounded";

interface Data {
    title: string;
    value: JSX.Element | string | number;
    icon: JSX.Element;
}
export interface KpiInterface {
    data: Data[];
    title: string;
    action?: () => void;
}

interface Props {
    kpis: KpiInterface[];
}

export const KPI = ({ kpis }: Props) => {
    const classes = useStyles();

    const getItem = (kpi: Data, index: number) => (
        <Grid
            key={`${kpi.title}-${index}`}
            item
            container
            alignItems="center"
            wrap="nowrap"
            spacing={2}
            xs={6}
        >
            <Grid item className={classes.icon}>
                {kpi.icon}
            </Grid>
            <Grid item container direction="column">
                <Grid item>
                    <Typography variant="body2">{kpi.title}</Typography>
                </Grid>
                <Grid item>
                    {isValidElement(kpi.value) ? (
                        kpi.value
                    ) : (
                        <Typography>{kpi.value}</Typography>
                    )}
                </Grid>
            </Grid>
        </Grid>
    );

    return (
        <Grid container spacing={2}>
            {kpis.map((kpi, index) => (
                <Grid
                    key={`kpi-${index}`}
                    item
                    container
                    justify="space-between"
                    wrap="nowrap"
                    md={12}
                    lg={6}
                >
                    <Paper className={classes.paper}>
                        <Grid
                            item
                            container
                            direction="column"
                            spacing={2}
                            className={classes.container}
                        >
                            <Grid
                                item
                                container
                                wrap="nowrap"
                                justify="space-between"
                            >
                                <Grid item>
                                    <Typography variant="h6">
                                        {kpi.title}
                                    </Typography>
                                </Grid>
                                {kpi.action && (
                                    <Grid item>
                                        <IconButton
                                            size="small"
                                            onClick={kpi.action}
                                        >
                                            <EditRoundedIcon />
                                        </IconButton>
                                    </Grid>
                                )}
                            </Grid>
                            <Grid item container spacing={2}>
                                {kpi.data.map((data, index) =>
                                    getItem(data, index)
                                )}
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(2, 3),
    },
    icon: {
        display: "flex",
        alignSelf: "center",
    },
    paper: {
        width: "100%",
    },
}));
