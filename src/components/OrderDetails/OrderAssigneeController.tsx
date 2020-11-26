import React, { useContext, useEffect, useState } from "react";
import { Grid, Typography, TextField, MenuItem } from "@material-ui/core";
import firebase from "firebase/app";
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

    console.log(typeof(currentAssignee))
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
        <TextField
            select
            variant="outlined"
            fullWidth
            value={currentAssignee || ' '}
            size="small"
            onChange={(e) => setCurrentAssignee(e.target.value)}
        >
            <MenuItem value=" ">Not Assigned Yet</MenuItem>
            {userOptions.map((option, index) => (
                <MenuItem key={`status-${index}`} value={option.email}>
                    {option.email}
                </MenuItem>
            ))}
        </TextField>
    );
};
