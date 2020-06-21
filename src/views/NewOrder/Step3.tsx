import React, { useMemo, useState, useContext } from 'react';
import { Grid, Typography, Divider } from '@material-ui/core';
import { CreateWrapper } from '../../components/CreateWrapper';
import * as firebase from 'firebase/app';
import { OrderType, OrderData } from '../../Interfaces';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import { UserContext } from '../../context/UserContext';

interface Props {
    data: OrderData
    orderType: OrderType
}

const orderTypeText = new Map<keyof OrderType, string>([
    ['lienSearch', 'Lien Search'],
    ['estoppelLetter', 'Estoppel Letter'],
    ['landSurvey', 'Land Survey'],
    ['permitResolution', 'Permit Resolution']
])

const orderInfoText = new Map<keyof OrderData, string>([
    ['folio', 'Folio'],
    ['legalDescription', 'legal Description'],
    ['requestedBy', 'Requested By'],
    ['closingDate', 'Closing Date'],
    ['neededDate', 'Needed Date'],
    ['seller', 'Seller'],
    ['buyer', 'Buyer'],
    ['listingAgent', 'Listing Agent'],
    ['listingAgentPhone', 'Listing Agent Phone']
])

export const Step3 = ({data, orderType}: Props) => {

    const [loading, setLoading] = useState(false);

    const userData = useContext(UserContext);

    const db = firebase.firestore();

    const onSubmit = async () => {
        setLoading(true);
        try {
            await db.collection('orders').add({
                ...data,
                orderType,
                userId: userData?.uid || '',
                orgId: userData?.orgId || '',
                created_on: firebase.firestore.FieldValue.serverTimestamp()
            })
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const getOrderTypes = () => {
        const elements = [];
        for (let [keys, value] of Object.entries(orderType)) {
            const el = (
                <Grid item container alignItems="center" justify="space-between">
                    <Grid item>
                        <Typography variant="body1">
                            {orderTypeText.get(keys as keyof OrderType)}
                        </Typography>
                    </Grid>
                    <Grid item>
                        {value ? <CheckIcon /> : <CloseIcon />}
                    </Grid>
                </Grid>
            )
            elements.push(el)
        }
        return elements;
    }

    const orderInfo: {[key in keyof Partial<OrderData>]: string | number} = useMemo(() => {
        return {
            folio: data.folio,
            legalDescription: data.legalDescription,
            seller: data.seller,
            buyer: data.buyer,
            listingAgent: data.listingAgent,
            listingAgentPhone: data.listingAgentPhone,
            requestedBy: data.requestedBy,
            closingDate: data.closingDate,
            neededDate: data.neededDate
        }
    }, [data])

    const displayInfo = () => {
        const elements = [];
        for (let [keys, value] of Object.entries(orderInfo)) {
            const el = (
                <Grid item container alignItems="center" justify="space-between">
                    <Grid item>
                        <Typography variant="body1">
                            {orderInfoText.get(keys as keyof OrderData)}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2">{value}</Typography>
                    </Grid>
                </Grid>
            )
            elements.push(el)
        }
        return elements;
    }

    
    
    const content =  (
        <>
            <Grid item>
                <Typography variant="h5">Review Order</Typography>
                <Divider />
            </Grid>
            <Grid item container spacing={3}>
                <Grid item container direction="column" xs={3} spacing={1}>
                    <Grid item>
                        <Typography variant="h6">Order Type</Typography>
                        <Divider />
                    </Grid>
                    {getOrderTypes()}
                </Grid>
                <Grid item container xs={3}  spacing={1} direction="column">
                        <Grid item>
                            <Typography variant="h6">Address Information</Typography>
                            <Divider />
                        </Grid>
                        <Grid item container direction="column" spacing={1}>
                            <Grid item container spacing={1}>
                                <Grid item>
                                    <Typography>{data.address.address1}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography>{data.address.address2}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography>{data.address.unit}</Typography>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Typography>{`${data.address.city}, ${data.address.state} ${data.address.zipCode}`}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item container xs={6} direction="column" spacing={1}>
                        <Grid item>
                            <Typography variant="h6">Order Detail</Typography>
                            <Divider />
                        </Grid>
                        {displayInfo()}
                    </Grid>
            </Grid>
        </>
    )

    return <CreateWrapper {...{content}} isLast onNext={onSubmit} disabled={loading} />
}