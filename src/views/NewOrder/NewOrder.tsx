import React, { useState } from "react";
import { FullScreenCreate } from "../../components/FullScreenCreate";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { Step1 } from "./Step1";
import { useParams, Redirect, useHistory } from "react-router-dom";
import { OrderType, OrderData } from "../../Interfaces";

const blankData: OrderData = {
    id: "",
    address: {
        address1: "",
        address2: "",
        unit: "",
        city: "",
        state: "",
        zipCode: "",
    },
    folio: 0,
    legalDescription: "",
    requestedBy: "",
    closingDate: "",
    neededDate: "",
    seller: "",
    buyer: "",
    listingAgent: "",
    listingAgentPhone: 0,
    landSurvey: {
        survey: false,
        surveyCert: false,
    },
};
export type Associations = Array<{ name: string; number: string }>;

export const blankAssociation = { name: "", number: "" };

export const blankOrderType = {
    lienSearch: false,
    permitResolution: false,
    estoppelLetter: false,
    landSurvey: false,
};

interface locationState {
    orderType: OrderType;
    data: OrderData;
    associations: Associations;
}

export const NewOrder = () => {
    const history = useHistory<locationState>();

    const {
        location: {
            state: {
                orderType,
                data: preData,
                associations: preAssocations,
            } = {
                orderType: null,
                data: null,
                associations: [{ ...blankAssociation }],
            },
        },
    } = history;

    const [data, setData] = useState<OrderData>(preData || blankData);
    const [associations, setAssociations] = useState<Associations>(
        preAssocations || [{ ...blankAssociation }]
    );
    const [orderTypes, setOrderTypes] = useState<OrderType>(
        orderType || blankOrderType
    );

    const { step } = useParams();

    if (!step) return <Redirect to="/" />;

    // const invalidStep = !parseInt(step) || parseInt(step) > 2 || (data === blankData);

    // if (invalidStep) return <Redirect to="new-order/1" />;

    const stepComponents = [
        {
            label: "Type of Order",
            component: <Step1 {...{ orderTypes }} {...{ setOrderTypes }} />,
        },
        {
            label: "Property Information",
            component: (
                <Step2
                    {...{ setData }}
                    {...{ setAssociations }}
                    {...{ associations }}
                    {...{ orderTypes }}
                    {...{ data }}
                />
            ),
        },
        {
            label: "Confirm Order",
            component: <Step3 {...{ data }} orderType={orderTypes} />,
        },
    ];

    return (
        <FullScreenCreate
            cancelPath="/"
            {...{ stepComponents }}
            activeStep={step}
            toolbarHeader="Create New Order"
        />
    );
};
