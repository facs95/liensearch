import { Button, Grid, TextField, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { TitleContext } from "../context/TitleContext";
import firebase from "firebase/app";
import { SnackContext } from "../context/SnackContext";

export const UserProfile = () => {
    const { setTitle } = useContext(TitleContext);
    const { setMessage, setMessageType } = useContext(SnackContext);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    

    useEffect(() => {
        setTitle("User Profile");
    }, [setTitle]);

    const onUpdatePassword = () => {
        setLoading(true);
        const user = firebase.auth().currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(
            user?.email ?? '',
            currentPassword
        );
        user?.reauthenticateWithCredential(credential)
            .then(function () {
                user.updatePassword(newPassword)
                    .then(() => {
                        setMessageType("success");
                        setMessage("Password Updated");
                    })
                    .catch((err) => {
                        setMessageType("error");
                        setMessage(err.message || "Please try again");
                    })
                    .finally(() => setLoading(false));
            })
            .catch((err) => {
                setMessageType("error");
                setMessage(err.message || "Please try again");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // const onUpdateProfile = () => {
    //     const user = firebase.auth().currentUser;
    //     user?.updateProfile({
    //         displayName: name
    //     }).then(() => {
    //         setMessageType("success");
    //         setMessage("Profile Updated");
    //     }).catch((err) => {
    //         setMessageType("error");
    //         setMessage(err.message || "Please try again");
    //     })
    // }

    return (
        <Grid container direction="column" spacing={4}>
            {/* <Grid item container alignItems="center">
                <Grid item xs={2}>
                    <Typography variant="subtitle1">First Name</Typography>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        size="small"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Grid>
            </Grid>
            <Grid item container alignItems="center">
                <Grid item xs={2}>
                    <Typography variant="subtitle1">Email Address</Typography>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        disabled
                        size="small"
                        helperText="At the moment we dont allow to change email address"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Grid>
            </Grid> */}
            {/* <Grid item container alignItems="center">
                <Grid item xs={2}></Grid>
                <Grid item xs={4}>
                    <Button
                        disabled={loading}
                        size="small"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={onUpdateProfile}
                    >
                        Update Profile
                    </Button>
                </Grid>
            </Grid> */}
            <Grid item container alignItems="center">
                <Grid item xs={2}>
                    <Typography variant="subtitle1">
                        Current Password
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        type="password"
                        size="small"
                        variant="outlined"
                        fullWidth
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </Grid>
            </Grid>
            <Grid item container alignItems="center">
                <Grid item xs={2}>
                    <Typography variant="subtitle1">New Password</Typography>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        type="password"
                        size="small"
                        variant="outlined"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </Grid>
            </Grid>
            <Grid item container alignItems="center">
                <Grid item xs={2}>
                    <Typography variant="subtitle1">
                        Confirm Password
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        type="password"
                        size="small"
                        variant="outlined"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Grid>
            </Grid>
            <Grid item container alignItems="center">
                <Grid item xs={2}></Grid>
                <Grid item xs={4}>
                    <Button
                        disabled={
                            loading ||
                            !currentPassword ||
                            !newPassword ||
                            !confirmPassword ||
                            newPassword !== confirmPassword
                        }
                        size="small"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={onUpdatePassword}
                    >
                        Update Password
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};
