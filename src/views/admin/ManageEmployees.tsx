import React, { useCallback, useContext, useEffect, useState } from "react";
import { Employee, Org } from "../../Interfaces";
import { CreateNewOrg } from "./CreateNewOrg";
import firebase from "firebase";
import { UserContext } from "../../context/UserContext";
import { SnackContext } from "../../context/SnackContext";
import { Grid } from "@material-ui/core";
import { TitleContext } from "../../context/TitleContext";
import { SetAdmin } from "./SetAdmin";
import { EmployeesTable } from "./EmployeesTable";

export const ManageEmployees = () => {
    const db = firebase.firestore();

    const [email, setEmail] = useState("");
    const [employees, setEmployees] = useState<Employee[]>([]);

    const { setMessage, setMessageType } = useContext(SnackContext);

    const { setTitle } = useContext(TitleContext);

    useEffect(() => {
        if (setTitle) {
            setTitle("Manage Employees");
        }
    }, [setTitle]);

    const getEmployees = useCallback(() => {
        db.collection("employees")
            .get()
            .then((querySnapshot) => {
                const arr: Employee[] = [];
                querySnapshot.forEach((doc) => {
                    arr.push({ ...doc.data(), id: doc.id } as Employee);
                });
                setEmployees(arr);
            })
            .catch((err) => console.log(err));
    }, [db]);

    useEffect(() => {
        getEmployees();
    }, [getEmployees]);

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
        <Grid container direction="column" spacing={5}>
            <Grid item>
                <SetAdmin
                    {...{ email }}
                    {...{ setEmail }}
                    {...{ onSetNewAdminClick }}
                />
            </Grid>
            <Grid item>
                <EmployeesTable {...{employees}} />
            </Grid>
        </Grid>
    );
};
