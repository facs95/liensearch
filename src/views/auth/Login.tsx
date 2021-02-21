import React, { useState } from "react";
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

export const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const classes = useStyles();
    const onSubmit = async (e: React.FormEvent) => {
        setLoading(true)
        e.preventDefault();
        setErrorMessage("");
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch (err) {
            setErrorMessage(err.message);
        } finally {
            setLoading(false)
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
                    <Grid item>
                        <TextField
                            type="email"
                            error={!!errorMessage}
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="email"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            fullWidth
                            error={!!errorMessage}
                            type="password"
                            label="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            variant="outlined"
                            helperText={
                                <Grid item>
                                    <Link to="/forgot-password">
                                        Forgot Password
                                    </Link>
                                </Grid>
                            }
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            type="submit"
                            disabled={!email || !password || loading}
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Login
                        </Button>
                    </Grid>
                    <Grid item container alignItems="center" spacing={1}>
                        <Grid item>
                            <Typography>Dont have an account?</Typography>
                        </Grid>
                        <Grid item>
                            <Link to="/create-account">Create account</Link>
                        </Grid>
                    </Grid>
                    {errorMessage && (
                        <Grid item>
                            <Typography color="error">
                                {errorMessage}
                            </Typography>
                        </Grid>
                    )}
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
