import {
    Divider,
    Grid,
    makeStyles,
    Paper,
    Typography,
} from "@material-ui/core";
import React from "react";

interface Props {
    kpis: {
        title: string;
        value: string | number;
        icon: JSX.Element;
    }[];
}

export const KPI = ({ kpis }: Props) => {
    const classes = useStyles();
    return (
        <Paper>
            <Grid container>
                {kpis.map((kpi, index) => (
                    <Grid
                        key={`kpi-${index}`}
                        item
                        container
                        justify="space-between"
                        wrap="nowrap"
                        xs={6}
                        md
                    >
                        <Grid
                            item
                            container
                            alignItems="center"
                            wrap="nowrap"
                            spacing={2}
                            className={classes.container}
                        >
                            <Grid item className={classes.icon}>{kpi.icon}</Grid>
                            <Grid item container direction="column">
                                <Grid item>
                                    <Typography variant="h6">
                                        {kpi.value}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2">
                                        {kpi.title}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        {index < kpis.length - 1 && (
                            <Grid item>
                                <Divider orientation="vertical" />
                            </Grid>
                        )}
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(2, 3),
    },
    icon: {
        display: 'flex',
        alignSelf: 'center'
    }
}));
