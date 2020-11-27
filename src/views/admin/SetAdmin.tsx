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
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    onSetNewAdminClick: () => void;
    loading: boolean
}

export const SetAdmin = ({
    email,
    setEmail,
    name,
    setName,
    onSetNewAdminClick,
    loading
}: Props) => {
    return (
        <Grid container direction="column" spacing={2}>
            <Grid item container direction="column" wrap="nowrap">
                <Grid item xs={12}>
                    <Typography variant="h6">Add New Employee</Typography>
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
                        label="Name"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="email"
                    />
                </Grid>
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
                        disabled={!email || !name || loading}
                        fullWidth
                        variant="contained"
                        onClick={onSetNewAdminClick}
                        color="primary"
                    >
                        Create Employee
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};
