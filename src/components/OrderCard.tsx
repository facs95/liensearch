import React from "react";
import { Paper, makeStyles, Grid, Typography } from "@material-ui/core";
import { orderTypeEnumKeys, OrderTypeEnum } from "../Interfaces";
import LandscapeIcon from "@material-ui/icons/Landscape";
import EmailIcon from "@material-ui/icons/Email";
import SearchIcon from "@material-ui/icons/Search";
import PolicyIcon from "@material-ui/icons/Policy";

interface Props {
    type: orderTypeEnumKeys;
    selected: Boolean;
}

const getIcon: Map<orderTypeEnumKeys, JSX.Element> = new Map([
    ["landSurvey", <LandscapeIcon />],
    ["estoppelLetter", <EmailIcon />],
    ["lienSearch", <SearchIcon />],
    ["permitResolution", <PolicyIcon />],
]);

export const OrderCard = ({ type, selected }: Props) => {
    const classes = useStyles();

    return (
        <Paper className={`${classes.container} ${selected ? classes.selected : ''}`}>
            <Grid container alignItems="center" spacing={1}>
                <Grid item>
                    <div>{getIcon.get(type)}</div>
                </Grid>
                <Grid item>
                    <Typography variant="h6">
                        {OrderTypeEnum[type]}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(3),
    },
    icon: {
        margin: theme.spacing(0, 2),
    },
    selected: {
        borderColor: theme.palette.primary.main,
        border: 'solid'
    }
}));
