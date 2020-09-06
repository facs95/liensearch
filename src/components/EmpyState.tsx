import React from "react";
import { Typography, Grid, Button, makeStyles } from "@material-ui/core";

interface Props {
    imageFile: string;
    title: string;
    description?: string;
    button?: { text: string; onClick: () => void; disabled?: boolean };
    documentation?: { text: string; link: string };
}

export const EmptyState = ({
    imageFile,
    title,
    description,
    button,
}: Props) => {

    const classes = useStyles();

    return (
            <Grid
                item
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={3}
            >
                <Grid item>
                    <img
                        className={classes.image}
                        src={`${process.env.PUBLIC_URL}/Illustrations/${imageFile}`}
                        alt=""
                    ></img>
                </Grid>
                <Grid item>
                    <Typography variant="h6">{title}</Typography>
                </Grid>
                {description && (
                    <Grid item xs={8}>
                        <Typography align="center" variant="body2">
                            {description}
                        </Typography>
                    </Grid>
                )}

                {button && (
                    <Grid item>
                        <Button
                            data-test="button_emptyCreate"
                            disabled={button.disabled}
                            color="primary"
                            size="large"
                            variant="contained"
                            onClick={button.onClick}
                        >
                            {button.text}
                        </Button>
                    </Grid>
                )}
            </Grid>
    );
};

const useStyles = makeStyles(theme => ({
    image: {
        maxWidth: '350px',
        fill: theme.palette.primary.main
    }
}))
