import React, {useState } from 'react';
import {
    TextField,
    Button,
    Grid,
    makeStyles,
    Typography
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import * as firebase from 'firebase/app';

export const CreateAccount: React.FC = () => {
    const classes = useStyles();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            await firebase.auth().createUserWithEmailAndPassword(email, password);
        } catch (err) {
            setErrorMessage(err.message);
        }
    }

    return(
        <form className={classes.formContainer} onSubmit={(e) => onSubmit(e)}>
            <Grid container direction="column" alignItems="stretch" spacing={4} >
                <Grid item>
                    <TextField type="email" error={!!errorMessage} fullWidth value={email} onChange={(e) => setEmail(e.target.value)} label="Email" variant="outlined"/>
                </Grid>
                <Grid item>
                    <TextField fullWidth error={!!errorMessage} type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} variant="outlined"/>
                </Grid>
                <Grid item>
                    <TextField fullWidth error={!!errorMessage} type="password" label="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} variant="outlined"/>
                </Grid>
                <Grid item>
                    <Button disabled={!email || !password || password !== confirmPassword} type="submit" fullWidth variant="contained" color="primary">Submit</Button>
                </Grid>
                <Grid item container alignItems="center" spacing={1}>
                    <Grid item>
                        <Typography>Already have an account?</Typography>
                    </Grid>
                    <Grid item>
                        <Link to="/">
                            Login
                        </Link>
                    </Grid>
                </Grid>
                {errorMessage && (
                    <Grid item>
                        <Typography color="error">{errorMessage}</Typography>
                    </Grid>
                )}

            </Grid>
        </form>
    )
}

const useStyles = makeStyles(() => ({
    formContainer: {
        width: '50vh'
    }
}));