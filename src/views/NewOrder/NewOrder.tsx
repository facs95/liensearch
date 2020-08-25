import React, { useState } from "react";
import { FullScreenCreate } from "../../components/FullScreenCreate";
import { Step3 } from "./Step3";
import { Step1 } from "./Step1";
import { useParams, Redirect, useHistory } from "react-router-dom";
import { OrderType, OrderData } from "../../Interfaces";
import { CreateOrderForm } from "../../components/CreateOrderForm";

const blankData: OrderData = {
    address: {
        address1: "",
        address2: "",
        unit: "",
        city: "",
        state: "",
        zipCode: "",
    },
    orderNumber: '',
    specialInstructions: '',
    folio: 0,
    legalDescription: "",
    closingDate: "",
    neededDate: "",
    seller: "",
    buyer: "",
    listingAgent: "",
    listingAgentPhone: 0,
    landSurvey: {
        lenderCertification: '',
        buyerCertification: '',
        underwriterCertification: '',
        titleCompany: '',
        hardCopy: false,
    },
};
export type Associations = Array<{ name: string; number: string }>;

export const blankAssociation = { name: "", number: "" };

export const blankOrderType: OrderType = {
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

    const { step, id } = useParams();

    const basePath = '/new-order';


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
                <CreateOrderForm
                    {...{ setData }}
                    {...{ setAssociations }}
                    {...{ associations }}
                    {...{ orderTypes }}
                    {...{ data }}
                    {...{basePath}}
                />
            ),
        },
        {
            label: "Confirm Order",
            component: (
                <Step3 {...{ id }} {...{ data }} orderType={orderTypes} />
            ),
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
