import React, { useState, useEffect, useRef } from "react";
import { makeStyles, Snackbar, IconButton, Slide } from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import ErrorIcon from "@material-ui/icons/Error";

const TRANSITION_TIMEOUT = 400;

interface Props {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    messageType?: "error" | "success"; // error is default
}

function SlideTransition(props: TransitionProps) {
    return <Slide {...props} direction="up" timeout={TRANSITION_TIMEOUT} />;
}

export const MessageSnackbar = ({
    message,
    setMessage,
    messageType = "error",
}: Props) => {
    const classes = useStyles();

    const [open, setOpen] = useState(message ? true : false);

    const timeoutRef = useRef<number>(0);
    useEffect(() => {
        return () => window.clearTimeout(timeoutRef.current);
    }, []);

    const handleClose = () => {
        window.clearTimeout(timeoutRef.current);
        setOpen(false);
        timeoutRef.current = window.setTimeout(
            () => setMessage(""),
            TRANSITION_TIMEOUT
        );
    };

    useEffect(() => {
        setOpen(message ? true : false);
    }, [message]);

    return (
        <Snackbar
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            autoHideDuration={6000}
            ContentProps={{
                className:
                    messageType === "error" ? classes.error : classes.success,
            }}
            TransitionComponent={SlideTransition}
            message={
                <div className={classes.message}>
                    {messageType === "error" && (
                        <ErrorIcon className={classes.icon} />
                    )}
                    {messageType === "success" && (
                        <CheckIcon className={classes.icon} />
                    )}
                    {message}
                </div>
            }
            action={[
                <IconButton
                    key="close"
                    aria-label="close"
                    color="inherit"
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>,
            ]}
        />
    );
};

const useStyles = makeStyles((theme) => ({
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    success: {
        backgroundColor: "green",
    },
    message: {
        display: "flex",
        alignItems: "center",
    },
    icon: {
        marginRight: theme.spacing(1),
    },
}));
