import React, {useState } from 'react';
import {
    TextField,
    Button,
    Grid,
    makeStyles,
    Typography
} from '@material-ui/core';
import * as firebase from 'firebase/app';

export const Login: React.FC = () => {
    const classes = useStyles();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            const response = await firebase.auth().signInWithEmailAndPassword(email, password);
            console.log(response);
        } catch (err) {
            setErrorMessage(err.message);
        }
    }

    return(
        <form className={classes.formContainer} onSubmit={(e) => onSubmit(e)}>
            <Grid container direction="column" alignItems="stretch" spacing={4} >
                <Grid item>
                    <TextField type="email" error={!!errorMessage} fullWidth value={email} onChange={(e) => setEmail(e.target.value)} label="email" variant="outlined"/>
                </Grid>
                <Grid item>
                    <TextField fullWidth error={!!errorMessage} type="password" label="password" value={password} onChange={(e) => setPassword(e.target.value)} variant="outlined"/>
                </Grid>
                <Grid item>
                    <Button type="submit" fullWidth variant="contained" color="primary">Submit</Button>
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