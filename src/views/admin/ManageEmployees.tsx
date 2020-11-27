import React, { useCallback, useContext, useEffect, useState } from "react";
import { Org } from "../../Interfaces";
import { CreateNewOrg } from "./CreateNewOrg";
import firebase from "firebase";
import { UserContext } from "../../context/UserContext";
import { SnackContext } from "../../context/SnackContext";
import { Grid } from "@material-ui/core";
import { TitleContext } from "../../context/TitleContext";

export const ManageEmployees = () => {
    const db = firebase.firestore();

    const [orgs, setOrgs] = useState<Array<Org>>([]);
    const [selectedOrg, setSelectedOrg] = useState("");
    const [orgPhoneNumber, setOrgPhoneNumber] = useState("");
    const [orgAddress, setOrgAddress] = useState("");
    const [orgName, setOrgName] = useState("");

    const { setMessage, setMessageType } = useContext(SnackContext);

    const {setTitle} = useContext(TitleContext);

    useEffect(() => {
        if (setTitle) {
            setTitle('Manage Clients')
        }
    }, [setTitle])

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

    const onCreateOrgClick = async () => {
        try {
            await db.collection("organizations").add({
                name: orgName,
                users: [],
                phoneNumber: orgPhoneNumber,
                address: orgAddress,
                created_on: firebase.firestore.FieldValue.serverTimestamp(),
            });
            setMessageType("success");
            setMessage("Org Created Succesfully");
            setOrgName("");
            getOrgs();
        } catch (err) {
            setMessageType("error");
            setMessage(err.message || "Please try again");
        }
    };

    return (
        <Grid container>
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
    );
};
