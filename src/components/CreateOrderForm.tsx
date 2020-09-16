import "date-fns";
import React from "react";
import { Grid, Typography, Divider } from "@material-ui/core";
import { CreateWrapper } from "./CreateWrapper";
import { useForm } from "react-hook-form";
import { CreateForm, InputList } from "./CreateForm";
import { AssociationForm } from "./AssociationForm";
import { LandSurveyForm } from "./LandSurveryForm";
import { useHistory } from "react-router-dom";
import { Associations, OrderData, OrderType } from "../Interfaces";
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from "@material-ui/pickers";

interface Props {
    setData: React.Dispatch<React.SetStateAction<OrderData>>;
    setAssociations: React.Dispatch<React.SetStateAction<Associations>>;
    associations: Associations;
    orderTypes: OrderType;
    data: OrderData;
    basePath: string;
}

export const CreateOrderForm = ({
    basePath,
    setData,
    setAssociations,
    associations,
    orderTypes,
    data,
}: Props) => {
    const { register, handleSubmit, setValue, getValues, watch } = useForm<
        OrderData
    >({
        defaultValues: {
            ...data,
        },
    });

    const { neededDate } = watch();
    console.log(getValues('neededDate'));

    const history = useHistory();

    const onSubmit = (data: OrderData) => {
        setData(data);
        history.push(`${basePath}/3`, {
            orderType: orderTypes,
            data,
            associations,
        });
    };

    const addressData: InputList = [
        {
            label: "Address 1",
            name: "address.address1",
            md: 6,
            xs: 12,
        },
        {
            label: "Address 2",
            name: "address.address2",
            required: false,
            md: 6,
            xs: 12,
        },
        {
            label: "Unit / Suite",
            name: "address.unit",
            required: false,
            md: 3,
            xs: 12,
        },
        {
            label: "City",
            name: "address.city",
            md: 3,
            xs: 12,
        },
        {
            label: "State",
            name: "address.state",
            md: 3,
            xs: 12,
        },
        {
            label: "Zip Code",
            name: "address.zipCode",
            md: 3,
            xs: 12,
        },
    ];

    const legalData: InputList = [
        {
            label: "Order #",
            name: "orderNumber",
            md: 4,
            xs: 12,
        },
        {
            label: "Folio",
            name: "folio",
            md: 4,
            xs: 12,
        },
        {
            label: "Legal Description",
            name: "legalDescription",
            md: 4,
            xs: 12,
        },
        {
            label: "Seller",
            name: "seller",
            md: 3,
            xs: 12,
        },
        {
            label: "Buyer",
            name: "buyer",
            md: 3,
            xs: 12,
        },
        {
            label: "Listing Agent",
            name: "listingAgent",
            required: false,
            md: 3,
            xs: 12,
        },
        {
            label: "Listing Agent Phone",
            name: "listingAgentPhone",
            required: false,
            md: 3,
            xs: 12,
        },
        {
            label: "Special Instructions",
            name: "specialInstructions",
            required: false,
            md: 12,
            xs: 12,
        },
    ];

    const addressForm = (
        <>
            <Grid item xs={12}>
                <Typography variant="h6">Property Address</Typography>
                <Divider />
            </Grid>
            <CreateForm {...{ register }} inputList={addressData} />
        </>
    );

    const legalForm = (
        <>
            <Grid item xs={12}>
                <Typography variant="h6">Order Information</Typography>
                <Divider />
            </Grid>
            <CreateForm {...{ register }} inputList={legalData} />
            <Grid item xs={12} md={6}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        fullWidth
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        inputVariant="outlined"
                        label={"Needed Date"}
                        value={getValues("neededDate")}
                        onChange={(e) => {
                            const newDate = e?.toLocaleDateString();
                            console.log(newDate);
                            setValue("neededDate", newDate, {
                                shouldDirty: true,
                            });
                        }}
                        KeyboardButtonProps={{
                            "aria-label": "change date",
                        }}
                    />
                </MuiPickersUtilsProvider>
            </Grid>
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
                    <Grid
                        item
                        container
                        spacing={2}
                        xs={12}
                        md={orderTypes.landSurvey ? 6 : 12}
                        direction="column"
                    >
                        <AssociationForm
                            {...{ setAssociations }}
                            {...{ associations }}
                        />
                    </Grid>
                )}
                {orderTypes.landSurvey && (
                    <Grid
                        item
                        container
                        spacing={2}
                        xs={12}
                        md={orderTypes.estoppelLetter ? 6 : 12}
                        direction="column"
                    >
                        <LandSurveyForm {...{ register }} />
                    </Grid>
                )}
            </Grid>
        </>
    );

    return <CreateWrapper {...{ content }} onNext={handleSubmit(onSubmit)} />;
};
