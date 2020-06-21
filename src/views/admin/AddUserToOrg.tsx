import React from "react";
import {
    Grid,
    Typography,
    TextField,
    Button,
    Divider,
    MenuItem,
} from "@material-ui/core";
import { Org } from "./ManageAdmin";

interface Props {
    userToOrg: string;
    setUserToOrg: React.Dispatch<React.SetStateAction<string>>;
    selectedOrg: string;
    setSelectedOrg: React.Dispatch<React.SetStateAction<string>>;
    orgs: Array<Org>;
    onAddUserToOrgClick: () => void;
}

export const AddUserToOrg = ({
    userToOrg,
    setUserToOrg,
    selectedOrg,
    setSelectedOrg,
    orgs,
    onAddUserToOrgClick,
}: Props) => {
    return (
        <>
            <Grid item container direction="column" wrap="nowrap">
                <Grid item xs={12}>
                    <Typography variant="h6">Add User to Org</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
            </Grid>
            <Grid item container direction="column" spacing={2}>
                <Grid item>
                    <TextField
                        size="small"
                        fullWidth
                        label="Email"
                        variant="outlined"
                        value={userToOrg}
                        onChange={(e) => setUserToOrg(e.target.value)}
                        type="email"
                    />
                </Grid>
                <Grid item>
                    <TextField
                        size="small"
                        variant="outlined"
                        fullWidth
                        select
                        value={selectedOrg}
                        onChange={(e) => setSelectedOrg(e.target.value)}
                    >
                        {orgs.length === 0 ? (
                            <MenuItem value="">No Organizations</MenuItem>
                        ) : (
                            orgs.map((org, index) => (
                                <MenuItem key={index} value={org.id}>
                                    {org.name}
                                </MenuItem>
                            ))
                        )}
                    </TextField>
                </Grid>
                <Grid item>
                    <Button
                        disabled={!userToOrg || !selectedOrg}
                        fullWidth
                        variant="contained"
                        onClick={onAddUserToOrgClick}
                        color="primary"
                    >
                        Add User
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};
