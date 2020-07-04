import React, { useContext, useEffect, useState } from "react";
import { Grid, Typography, TextField, MenuItem } from "@material-ui/core";
import * as firebase from "firebase/app";
import { UserData } from "../../Interfaces";
import { UserContext } from "../../context/UserContext";

interface Props {
    currentAssignee: string;
    setCurrentAssignee: React.Dispatch<React.SetStateAction<string>>;
}

export const OrderAssigneeController = ({
    currentAssignee,
    setCurrentAssignee,
}: Props) => {
    const [userOptions, setUserOptions] = useState<UserData[]>([]);

    const user = useContext(UserContext);

    const db = firebase.firestore();

    useEffect(() => {
        if (user?.admin) {
            db.collection("employees")
                .get()
                .then((querySnapshot) => {
                    const arr: UserData[] = [];
                    querySnapshot.forEach((doc) => {
                        arr.push({ ...(doc.data() as UserData) });
                    });
                    setUserOptions(arr);
                })
                .catch((err) => console.log(err));
        }
    }, [user, db]);

    return (
        <Grid item container alignItems="center" justify="space-between">
            <Grid item>
                <Typography variant="body1">Asignee</Typography>
            </Grid>
            <Grid item xs={7}>
                {user?.admin ? (
                    <TextField
                        label="Assign Employee"
                        select
                        variant="outlined"
                        fullWidth
                        value={currentAssignee}
                        onChange={(e) => setCurrentAssignee(e.target.value)}
                    >
                        {userOptions.map((option, index) => (
                            <MenuItem
                                key={`status-${index}`}
                                value={option.email}
                            >
                                {option.email}
                            </MenuItem>
                        ))}
                    </TextField>
                ) : (
                    <Typography variant="body2">
                        {currentAssignee ? currentAssignee : "Not Assigned Yet"}
                    </Typography>
                )}
            </Grid>
        </Grid>
    );
};
