import React from "react";
import {
    Grid,
    Typography,
    TextField,
    Button,
    Divider,
} from "@material-ui/core";

interface Props {
    orgName: string
    setOrgName: React.Dispatch<React.SetStateAction<string>>
    phoneNumber: string
    setPhoneNumber: React.Dispatch<React.SetStateAction<string>>
    address: string
    setAddress: React.Dispatch<React.SetStateAction<string>>
    onCreateOrgClick: () => void;
}

export const CreateNewOrg = ({
    orgName,
    setOrgName,
    onCreateOrgClick,
    phoneNumber,
    setAddress,
    address,
    setPhoneNumber
}: Props) => {
    return (
        <>
            <Grid item container direction="column" wrap="nowrap">
                <Grid item xs={12}>
                    <Typography variant="h6">
                        Create New Organization
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
            </Grid>
            <Grid item container spacing={2} direction="column">
                <Grid item>
                    <TextField
                        fullWidth
                        size="small"
                        label="Company Name"
                        variant="outlined"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        fullWidth
                        size="small"
                        label="Phone Number"
                        variant="outlined"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        fullWidth
                        size="small"
                        label="Address"
                        variant="outlined"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </Grid>
                <Grid item>
                    <Button
                        disabled={!address || !phoneNumber || !orgName}
                        fullWidth
                        variant="contained"
                        onClick={onCreateOrgClick}
                        color="primary"
                    >
                        Create Organization
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};
