import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@material-ui/core";

interface Props {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    title: string
    description: string
    confirmAction?: () => void;
}

export const WarnModal = ({ open, description, title, setOpen, confirmAction }: Props) => {
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
                {confirmAction && (
                    <Button onClick={confirmAction} color="primary" autoFocus>
                        Agree
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};
