import React, { useContext, useState } from "react";
import {
    TextField,
    Button,
    Grid,
    Typography,
    makeStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import { PaperWrapper } from "../../components/PaperWrapper";
import { SnackContext } from "../../context/SnackContext";

export const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState<string>("");

    const { setMessage, setMessageType } = useContext(SnackContext);

    const classes = useStyles();
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await firebase.auth().sendPasswordResetEmail(email);
            setMessageType("success");
            setMessage("Email Sent Succesfully");
        } catch (err) {
            setMessage(
                err.message ||
                    "We had troubles sending the email. Please try again."
            );
        }
    };

    return (
        <PaperWrapper>
            <form onSubmit={(e) => onSubmit(e)} className={classes.form}>
                <img
                    alt=""
                    className={classes.logo}
                    src={`${process.env.PUBLIC_URL}/logo.png`}
                />
                <Grid
                    container
                    direction="column"
                    alignItems="stretch"
                    spacing={4}
                >
                    {/* <Grid item >
                        <Typography align="center" variant="h5">Login</Typography>
                    </Grid> */}
                    <Grid item>
                        <TextField
                            type="email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="email"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            type="submit"
                            disabled={!email}
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Submit Email
                        </Button>
                    </Grid>
                    <Grid item container alignItems="center" spacing={1}>
                        <Grid item>
                            <Typography>Already have your password?</Typography>
                        </Grid>
                        <Grid item>
                            <Link to="/">Login</Link>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </PaperWrapper>
    );
};

const useStyles = makeStyles((theme) => ({
    title: {
        alignSelf: "center",
    },
    logo: {
        height: 70,
        marginBottom: theme.spacing(3),
    },
    form: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
}));
