import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import * as firebase from 'firebase/app';
import { OrderData } from '../Interfaces';
import { Paper, Grid, Typography, makeStyles } from '@material-ui/core';
import { LoadingContext } from '../context/LoadingContext';

export const OrderInfo = () => {

    const [data, setData] = useState<OrderData | null>(null);

    const classes = useStyles();
    
    const {setLoading} = useContext(LoadingContext)

    const {id} = useParams();

    const db = firebase.firestore();
    const user = firebase.auth().currentUser;

    useEffect(() => {
        setLoading(true)
        if (id) {
            db.collection("orders").doc(id).get().then(doc => {
                if (!doc.exists) {
                    console.log('No such document!');
                } else {
                    setData({...doc.data(), id: doc.id} as OrderData);
                    console.log('Document data:', doc.data());
                }
            }).catch(err => console.log(err)).finally(() => {
                setLoading(false)
            });
        }
    }, [db, user, id, setLoading])

    const orderData = (
        <Paper>
            <Grid container className={classes.cardContainer}>
                <Grid item>
                    <Typography variant="h6">Order Info</Typography>
                </Grid>
                <Grid item>

                </Grid>
            </Grid>
        </Paper>
    )

    return (
        <>
            <Grid item>
                <Typography variant="h5">Order Info</Typography>
            </Grid>
            <Grid item container spacing={3}>
                <Grid item xs={8}>
                    {orderData}
                </Grid>
            </Grid>
        </>
    )
}

const useStyles = makeStyles(theme => ({
    cardContainer: {
        padding: theme.spacing(3)
    }
}))