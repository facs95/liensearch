import React from "react";
import { Grid, Button, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";

interface Props {
    content: JSX.Element;
    isLast?: boolean;
    isFirst?: boolean;
    onNext: () => void;
    onCancel?: () => void;
    disabled?: boolean;
    hideActions?: boolean;
}

export const CreateWrapper = ({
    content,
    isLast,
    isFirst,
    onNext,
    onCancel,
    disabled = false,
    hideActions,
}: Props) => {
    const classes = useStyles();
    const history = useHistory();

    const onBack = () => history.goBack();

    return (
        <Grid
            item
            container
            direction="column"
            spacing={3}
            className={classes.container}
        >
            {content}
            {!hideActions && (
                <Grid
                    item
                    container
                    spacing={2}
                    justify="flex-end"
                    className={classes.buttons}
                >
                    <Grid item>
                        <Button
                            onClick={onCancel || onBack}
                            variant="contained"
                            color="primary"
                        >
                            {isFirst ? "Cancel" : "Back"}
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            onClick={onNext}
                            disabled={disabled}
                            variant="contained"
                            color="primary"
                        >
                            {isLast ? "Finish" : "Next"}
                        </Button>
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
};

const useStyles = makeStyles((theme) => ({
    container: {
        margin: theme.spacing(0, 5),
    },
    buttons: {
        marginBottom: theme.spacing(2),
    },
}));
