import React, { useContext, useState, useEffect, useCallback } from 'react';
import { UserContext } from '../../context/UserContext';
import { Redirect } from 'react-router-dom';
import { TextField, Button, Grid, Typography, Divider, MenuItem } from '@material-ui/core';
import * as firebase from 'firebase';
import { MessageSnackbar } from '../../components/SnackMessage';

interface Org {
    name: string
    users: string[]
    id: string
}

export const ManageAdming = () => {
    
    const db = firebase.firestore();
    const currentUser = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [orgName, setOrgName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [orgs, setOrgs] = useState<Array<Org>>([]);
    const [selectedOrg, setSelectedOrg] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    const getOrgs = useCallback(() => {
        db.collection("organizations").get().then((querySnapshot) => {
            const arr : Org[] = [];
            querySnapshot.forEach((doc) => {
                arr.push({...doc.data(), id: doc.id} as Org);
            });
            setOrgs(arr);
            setSelectedOrg(arr[0].id);
        }).catch(err => console.log(err))
    }, [db])

    useEffect(() => {
        getOrgs();
    }, [getOrgs])

    if (!currentUser?.admin) return <Redirect to="/" />;

    const setAdmin = () => {
        const setAdminUser = firebase.functions().httpsCallable('setAdminUser');
        setAdminUser({email}).then((result) => {
            console.log(result);
            setErrorMessage('User set to admin');
            setMessageType('success')
        }).catch(err => {
            setErrorMessage(err.message);
            setMessageType('error')
        });
    };

    const onAdminClick = () => {
        setAdmin();
    }

    const onCreateOrgClick = async () => {
        try {
            await db.collection('organizations').add({
                name: orgName,
                users: [],
                created_on: firebase.firestore.FieldValue.serverTimestamp()
            })
            setOrgName('');
            getOrgs();
        } catch (err) {
            console.log(err)
        }
    }

    
    
    return (
        <>
            <MessageSnackbar message={errorMessage} setMessage={setErrorMessage} {...{messageType}} />
            <Grid item container>
                <Typography variant="h6">Set New Admin</Typography>
                <Divider />
            </Grid>
            <Grid item container spacing={1} alignItems="center">
                <Grid item>
                    <TextField fullWidth label="Email" variant="outlined" value={email} onChange={e => setEmail(e.target.value)} type="email"  />
                </Grid>
                <Grid item>
                    <Button variant="outlined" onClick={onAdminClick} color="primary">Set Admin</Button>
                </Grid>
            </Grid>
            <Grid item container>
                <Typography variant="h6">Create New Organization</Typography>
                <Divider />
            </Grid>
            <Grid item container spacing={1} alignItems="center">
                <Grid item>
                    <TextField fullWidth label="Company Name" variant="outlined" value={orgName} onChange={e => setOrgName(e.target.value)}  />
                </Grid>
                <Grid item>
                    <Button variant="outlined" onClick={onCreateOrgClick} color="primary">Create Organization</Button>
                </Grid>
            </Grid>
            <Grid item container>
                <Typography variant="h6">Add User To Org</Typography>
                <Divider />
            </Grid>
            <Grid item container>
                <TextField select value={selectedOrg} onChange={e => setSelectedOrg(e.target.value)}>
                    {orgs.map(org => (
                        <MenuItem value={org.id}>{org.name}</MenuItem>
                    ))}
                    <MenuItem value=''>No Organizations</MenuItem>
                </TextField>
            </Grid>
        </>
    )
}