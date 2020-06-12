import React from 'react';
import { Grid, Typography, TextField, makeStyles, Divider } from '@material-ui/core';
import { CreateWrapper } from '../../components/CreateWrapper';
import { useForm } from "react-hook-form";
import { Associations } from './NewOrder';
import { CreateForm, InputList } from '../../components/CreateForm';
import { AssociationForm } from './AssociationForm';
import { LandSurveyForm } from './LandSurveryForm';
import { useHistory } from 'react-router-dom';
import { OrderType, OrderData } from '../../Interfaces';


interface Props {
    setData: React.Dispatch<React.SetStateAction<OrderData>>,
    setAssociations: React.Dispatch<React.SetStateAction<Associations>>,
    associations: Associations
    orderTypes: OrderType
    data: OrderData
}



export const Step2 = ({setData, setAssociations, associations, orderTypes, data}: Props) => {
    
    const { register, handleSubmit, watch, errors } = useForm<OrderData>({defaultValues: {
        ...data
    }});

    const classes = useStyles();
    const history = useHistory();

    const onSubmit = (data: OrderData) => {
        setData(data);
        history.push('/new-order/3', {
            orderType: orderTypes,
            data,
            associations
        })
    }

    const addressData: InputList = [{
        label: 'Address 1',
        name: 'address.address1',
        md: 6,
        xs: 12
    }, {
        label: 'Address 2',
        name: 'address.address2',
        required: false,
        md: 6,
        xs: 12
    },{
        label: 'Unit / Suite',
        name: 'address.unit',
        required: false,
        md: 3,
        xs: 12
    },{
        label: 'City',
        name: 'address.city',
        md: 3,
        xs: 12
    },{
        label: 'State',
        name: 'address.state',
        md: 3,
        xs: 12
    }, {
        label: 'Zip Code',
        name: 'address.zipCode',
        md: 3,
        xs: 12
    }]

    const legalData: InputList= [{
        label: 'Folio',
        name: 'folio',
        md: 4,
        xs: 12
    }, {
        label: 'Legal Description',
        name: 'legalDescription',
        md: 4,
        xs: 12
    }, {
        label: 'Requested By',
        name: 'requestedBy',
        required: false,
        md: 4,
        xs: 12
    }, {
        label: 'Closing Date',
        name: 'closingDate',
        md: 6,
        xs: 12
    }, {
        label: 'Needed Date',
        name: 'neededDate',
        md: 6,
        xs: 12
    }, {
        label: 'Seller',
        name: 'seller',
        md: 3,
        xs: 12
    }, {
        label: 'Buyer',
        name: 'buyer',
        md: 3,
        xs: 12
    }, {
        label: 'Listing Agent',
        name: 'listingAgent',
        required: false,
        md: 3,
        xs: 12
    }, {
        label: 'Listing Agent Phone',
        name: 'listingAgentPhone',
        required: false,
        md: 3,
        xs: 12
    }];

   

    const addressForm = (
        <>
            <Grid item xs={12}>
                <Typography variant="h6">Property Address</Typography>
                <Divider />
            </Grid>
            <CreateForm {...{register}} inputList={addressData} />
        </>
    );

    const legalForm = (
        <>
            <Grid item xs={12}>
                <Typography variant="h6">Order Information</Typography>
                <Divider />
            </Grid>
            <CreateForm {...{register}} inputList={legalData} />
        </>
    );


    const content = (
        <>
            <Grid item container spacing={2}>
                {addressForm}
            </Grid>
            <Grid item container spacing={2}>
                {legalForm}
            </Grid>
            <Grid item container spacing={2}>
                {orderTypes.estoppelLetter && (
                    <Grid item container spacing={2} xs={12} md={orderTypes.landSurvey ? 6 : 12}>
                        <AssociationForm {...{setAssociations}} {...{associations}} />
                    </Grid>
                )}
                {orderTypes.landSurvey && (
                    <Grid item container spacing={2} xs={12} md={orderTypes.estoppelLetter ? 6 : 12} direction="column">
                        <LandSurveyForm {...{register}} />
                    </Grid>
                )}
            </Grid>
        </>
    )

    return <CreateWrapper {...{content}} onNext={handleSubmit(onSubmit)} />
}

const useStyles = makeStyles(() => ({
    container: {
        width:  '30vw',
        minWdith: '200px'
    }
}))