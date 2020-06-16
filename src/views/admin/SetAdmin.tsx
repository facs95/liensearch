import React from "react";
import {
    Grid,
    Typography,
    TextField,
    Button,
    Divider,
} from "@material-ui/core";

interface Props {
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    onSetNewAdminClick: () => void;
}

export const SetAdmin = ({ email, setEmail, onSetNewAdminClick }: Props) => {
    return (
        <>
            <Grid item container direction="column" wrap="nowrap">
                <Grid item xs={12}>
                    <Typography variant="h6">Set New Admin</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
            </Grid>
            <Grid item container spacing={2} direction="column">
                <Grid item>
                    <TextField
                        size="small"
                        fullWidth
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                    />
                </Grid>
                <Grid item>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={onSetNewAdminClick}
                        color="primary"
                    >
                        Set Admin
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};
