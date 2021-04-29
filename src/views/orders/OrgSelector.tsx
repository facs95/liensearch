import React, { useEffect, useState } from "react";
import { Grid, TextField, MenuItem } from "@material-ui/core";
import firebase from "firebase/app";
import { Org, OrgData } from "../../Interfaces";
import { UpdateFormType } from "./Filters";
import { useUser } from "../../context/UserContext";

interface Props {
    orgId: string;
    dispatch: UpdateFormType;
}

export const OrgSelector = ({ orgId, dispatch }: Props) => {
    const [orgOptions, setOrgOptions] = useState<Org[]>([]);
    const user = useUser();

    const db = firebase.firestore();

    useEffect(() => {
        if (user.admin) {
            db.collection("organizations")
                .get()
                .then((querySnapshot) => {
                    const arr: Org[] = [];
                    querySnapshot.forEach((doc) => {
                        arr.push({ id: doc.id, ...(doc.data() as OrgData) });
                    });
                    setOrgOptions(arr);
                })
                .catch((err) => console.log(err));
        }
    }, [user, db]);

    return (
        <Grid item>
            <TextField
                label="Organization"
                select
                variant="outlined"
                fullWidth
                value={orgId}
                name="organizations"
                size="small"
                onChange={dispatch}
            >
                <MenuItem value="">All</MenuItem>
                {orgOptions.map((option, index) => (
                    <MenuItem key={`status-${index}`} value={option.id}>
                        {option.name}
                    </MenuItem>
                ))}
            </TextField>
        </Grid>
    );
};
