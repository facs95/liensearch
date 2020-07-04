import React, { useContext, useState, useEffect, useCallback } from "react";
import { UserContext } from "../../context/UserContext";
import { Redirect } from "react-router-dom";
import { Grid } from "@material-ui/core";
import * as firebase from "firebase";
import { MessageSnackbar } from "../../components/SnackMessage";
import { SetAdmin } from "./SetAdmin";
import { CreateNewOrg } from "./CreateNewOrg";
import { AddUserToOrg } from "./AddUserToOrg";
import { Org } from "../../Interfaces";

export const ManageAdming = () => {
    const db = firebase.firestore();
    const currentUser = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [orgName, setOrgName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [orgs, setOrgs] = useState<Array<Org>>([]);
    const [selectedOrg, setSelectedOrg] = useState("");
    const [orgPhoneNumber, setOrgPhoneNumber] = useState("");
    const [orgAddress, setOrgAddress] = useState("");
    const [userToOrg, setUserToOrg] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">(
        "success"
    );

    const getOrgs = useCallback(() => {
        db.collection("organizations")
            .get()
            .then((querySnapshot) => {
                const arr: Org[] = [];
                querySnapshot.forEach((doc) => {
                    arr.push({ ...doc.data(), id: doc.id } as Org);
                });
                setOrgs(arr);
                setSelectedOrg(arr[0].id);
            })
            .catch((err) => console.log(err));
    }, [db]);

    useEffect(() => {
        getOrgs();
    }, [getOrgs]);

    if (!currentUser?.admin) return <Redirect to="/" />;

    const setNotificationMessage = (
        message: string,
        type: "success" | "error" = "error"
    ) => {
        setMessageType(type);
        setErrorMessage(message);
    };

    const setAdmin = () => {
        const setAdminUser = firebase.functions().httpsCallable("setAdminUser");
        setAdminUser({ email })
            .then(() => {
                setNotificationMessage("Admin Set Succesfully", "success");
            })
            .catch((err) => {
                setNotificationMessage(err.message || err);
            });
    };

    const onSetNewAdminClick = () => {
        setAdmin();
    };

    const onCreateOrgClick = async () => {
        try {
            await db.collection("organizations").add({
                name: orgName,
                users: [],
                phoneNumber: orgPhoneNumber,
                address: orgAddress,
                created_on: firebase.firestore.FieldValue.serverTimestamp(),
            });
            setNotificationMessage("Org Create Succesfully", "success");
            setOrgName("");
            getOrgs();
        } catch (err) {
            setNotificationMessage(err.message || err);
        }
    };

    const onAddUserToOrgClick = async () => {
        try {
            const addOrgToUser = firebase
                .functions()
                .httpsCallable("addOrgToUser");
            await addOrgToUser({ email: userToOrg, orgId: selectedOrg });
            setNotificationMessage("User Added to Org Succesfully", "success");
        } catch (err) {
            setNotificationMessage(err.message || err);
        }
    };

    return (
        <>
            <MessageSnackbar
                message={errorMessage}
                setMessage={setErrorMessage}
                {...{ messageType }}
            />
            <Grid item xs={4} container justify="center" spacing={3}>
                <Grid item container spacing={3}>
                    <SetAdmin
                        {...{ email }}
                        {...{ setEmail }}
                        {...{ onSetNewAdminClick }}
                    />
                </Grid>
                <Grid item container spacing={3}>
                    <CreateNewOrg
                        phoneNumber={orgPhoneNumber}
                        setPhoneNumber={setOrgPhoneNumber}
                        address={orgAddress}
                        setAddress={setOrgAddress}
                        {...{ onCreateOrgClick }}
                        {...{ orgName }}
                        {...{ setOrgName }}
                    />
                </Grid>
                <Grid item container spacing={3}>
                    <AddUserToOrg
                        {...{ orgs }}
                        {...{ userToOrg }}
                        {...{ setUserToOrg }}
                        {...{ selectedOrg }}
                        {...{ setSelectedOrg }}
                        {...{ onAddUserToOrgClick }}
                    />
                </Grid>
            </Grid>
        </>
    );
};
