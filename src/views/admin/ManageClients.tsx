import React, { useCallback, useContext, useEffect, useState } from "react";
import { Org } from "../../Interfaces";
import { CreateNewOrg } from "./CreateNewOrg";
import firebase from "firebase";
import { SnackContext } from "../../context/SnackContext";
import { TitleContext } from "../../context/TitleContext";
import { Grid } from "@material-ui/core";
import { OrgsTable } from "./OrgsTable";

export const ManageClients = () => {
    const db = firebase.firestore();

    const [orgs, setOrgs] = useState<Array<Org>>([]);
    const [loading, setLoading] = useState(false);
    const [orgPhoneNumber, setOrgPhoneNumber] = useState("");
    const [orgAddress, setOrgAddress] = useState("");
    const [orgName, setOrgName] = useState("");

    const { setTitle } = useContext(TitleContext);

    useEffect(() => {
        if (setTitle) {
            setTitle("Manage Clients");
        }
    }, [setTitle]);

    const { setMessage, setMessageType } = useContext(SnackContext);

    const getOrgs = useCallback(() => {
        db.collection("organizations")
            .get()
            .then((querySnapshot) => {
                const arr: Org[] = [];
                querySnapshot.forEach((doc) => {
                    arr.push({ ...doc.data(), id: doc.id } as Org);
                });
                setOrgs(arr);
            })
            .catch((err) => console.log(err));
    }, [db]);

    useEffect(() => {
        getOrgs()
    }, [getOrgs])

    const onCreateOrgClick = async () => {
        setLoading(true)
        try {
            await db.collection("organizations").add({
                name: orgName,
                users: [],
                phoneNumber: orgPhoneNumber,
                orderCount: 0,
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
        } finally {
            setLoading(false)
        }
    };

    return (
        <Grid container direction="column" spacing={5}>
            <Grid item>
                <CreateNewOrg
                    phoneNumber={orgPhoneNumber}
                    setPhoneNumber={setOrgPhoneNumber}
                    address={orgAddress}
                    setAddress={setOrgAddress}
                    {...{ onCreateOrgClick }}
                    {...{ orgName }}
                    {...{ setOrgName }}
                    {...{loading}}
                />
            </Grid>
            <Grid item>
                <OrgsTable {...{ orgs }} />
            </Grid>
        </Grid>
    );
};
