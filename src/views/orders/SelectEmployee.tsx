import React, { useContext, useEffect, useState } from "react";
import { TextField, MenuItem } from "@material-ui/core";
import firebase from "firebase/app";
import { UserData } from "../../Interfaces";
import { useUser } from "../../context/UserContext";
import { UpdateFormType } from "./Filters";

interface Props {
    currentEmployee: string;
    dispatch: UpdateFormType;
}

export const SelectEmployee = ({ currentEmployee, dispatch }: Props) => {
    const [userOptions, setUserOptions] = useState<UserData[]>([]);

    const user = useUser();

    const db = firebase.firestore();

    useEffect(() => {
        if (user.admin) {
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
            label="Assigned Employee"
            select
            variant="outlined"
            size="small"
            fullWidth
            value={currentEmployee}
            name="employee"
            onChange={dispatch}
        >
            <MenuItem value="">All</MenuItem>
            {userOptions.map((option, index) => (
                <MenuItem key={`status-${index}`} value={option.email}>
                    {option.email}
                </MenuItem>
            ))}
        </TextField>
    );
};
