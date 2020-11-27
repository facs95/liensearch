import React, { useCallback, useContext, useEffect, useState } from "react";
import { Employee } from "../../Interfaces";
import firebase from "firebase";
import { SnackContext } from "../../context/SnackContext";
import { Grid } from "@material-ui/core";
import { TitleContext } from "../../context/TitleContext";
import { SetAdmin } from "./SetAdmin";
import { EmployeesTable } from "./EmployeesTable";

export const ManageEmployees = () => {
    const db = firebase.firestore();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);

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
        setLoading(true)
        const setAdminUser = firebase
            .functions()
            .httpsCallable("createEmployee");
        setAdminUser({ email, name })
            .then(() => {
                setMessageType("success");
                setMessage("Admin Set Succesfully");
            })
            .catch((err) => {
                setMessageType("error");
                setMessage(err.message || "Please try again");
            }).finally(() => {
                getEmployees()
                setLoading(false)
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
                    {...{ name }}
                    {...{ setName }}
                    {...{ onSetNewAdminClick }}
                    {...{loading}}
                />
            </Grid>
            <Grid item>
                <EmployeesTable {...{ employees }} />
            </Grid>
        </Grid>
    );
};
