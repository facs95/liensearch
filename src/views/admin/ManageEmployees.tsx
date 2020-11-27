import React, { useCallback, useContext, useEffect, useState } from "react";
import { Org } from "../../Interfaces";
import { CreateNewOrg } from "./CreateNewOrg";
import firebase from "firebase";
import { UserContext } from "../../context/UserContext";
import { SnackContext } from "../../context/SnackContext";
import { Grid } from "@material-ui/core";
import { TitleContext } from "../../context/TitleContext";
import { SetAdmin } from "./SetAdmin";

export const ManageEmployees = () => {
    const db = firebase.firestore();

    const [email, setEmail] = useState("");

    const { setMessage, setMessageType } = useContext(SnackContext);

    const { setTitle } = useContext(TitleContext);

    useEffect(() => {
        if (setTitle) {
            setTitle("Manage Employees");
        }
    }, [setTitle]);

    const setAdmin = () => {
        const setAdminUser = firebase.functions().httpsCallable("setAdminUser");
        setAdminUser({ email })
            .then(() => {
                setMessageType("success");
                setMessage("Admin Set Succesfully");
            })
            .catch((err) => {
                setMessageType("error");
                setMessage(err.message || "Please try again");
            });
    };

    const onSetNewAdminClick = () => {
        setAdmin();
    };

    return (
        <Grid container>
            <SetAdmin
                {...{ email }}
                {...{ setEmail }}
                {...{ onSetNewAdminClick }}
            />
        </Grid>
    );
};
