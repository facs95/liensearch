import React, { useState, BaseSyntheticEvent } from "react";
import {
    TextField,
    Button,
    Grid,
    makeStyles,
    Typography,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import firebase from "firebase/app";
import { useForm } from "react-hook-form";
import PhoneNumber from "awesome-phonenumber";
import { User } from "../../Interfaces";
import { PaperWrapper } from "../../components/PaperWrapper";

interface UserCreation extends User {
    confirmPassword: string;
    password: string;
}

export const CreateAccount: React.FC = () => {
    const classes = useStyles();

    const [errorMessage, setErrorMessage] = useState<string>("");

    const { register, handleSubmit } = useForm<UserCreation>();

    const history = useHistory();

    const onSubmit = async (
        data: UserCreation,
        e: BaseSyntheticEvent<object, any, any> | undefined
    ) => {
        e && e.preventDefault();
        setErrorMessage("");
        let pn = new PhoneNumber(data.phoneNumber, "US");
        try {
            if (!pn.isValid())
                throw new Error("Please input valid phone number");
            const createUser = firebase.functions().httpsCallable("users-createUser");
            await createUser({
                email: data.email,
                password: data.password,
                name: data.name,
                orgId: data.orgId,
                phoneNumber: pn.getNumber(),
            });
            history.push("/");
        } catch (err) {
            setErrorMessage(err.message);
        }
    };

    return (
        <PaperWrapper>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
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
                    <Grid item className={classes.title}>
                        <Typography variant="h5">Create Account</Typography>
                    </Grid>
                    <Grid item>
                        <TextField
                            type="email"
                            error={!!errorMessage}
                            fullWidth
                            label="Email"
                            variant="outlined"
                            name="email"
                            inputRef={register}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            type="name"
                            error={!!errorMessage}
                            fullWidth
                            label="Name"
                            variant="outlined"
                            name="name"
                            inputRef={register}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            type="phone"
                            error={!!errorMessage}
                            fullWidth
                            label="Phone Number"
                            variant="outlined"
                            name="phoneNumber"
                            inputRef={register}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            type="id"
                            error={!!errorMessage}
                            fullWidth
                            label="Organization Id"
                            helperText="Id of the organization you belong"
                            variant="outlined"
                            name="orgId"
                            inputRef={register}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            fullWidth
                            error={!!errorMessage}
                            type="password"
                            label="Password"
                            variant="outlined"
                            name="password"
                            inputRef={register}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            fullWidth
                            error={!!errorMessage}
                            type="password"
                            label="Confirm Password"
                            variant="outlined"
                            name="confirmedPassword"
                            inputRef={register}
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Submit
                        </Button>
                    </Grid>
                    <Grid item container alignItems="center" spacing={1}>
                        <Grid item>
                            <Typography>Already have an account?</Typography>
                        </Grid>
                        <Grid item>
                            <Link to="/">Login</Link>
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

const useStyles = makeStyles(theme => ({
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
