import React, { useState, useEffect } from "react";
import { FullScreenCreate } from "../../components/FullScreenCreate";
import { Step3 } from "./Step3";
import { Step1 } from "./Step1";
import { useParams, Redirect, useHistory } from "react-router-dom";
import { OrderType, OrderData, Order, Associations } from "../../Interfaces";
import firebase from "firebase/app";
import { CircularProgress } from "@material-ui/core";
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

export const UpdateOrder = () => {
    const history = useHistory<locationState>();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<OrderData>(blankData);
    const [associations, setAssociations] = useState<Associations>([
        { ...blankAssociation },
    ]);
    const [orderTypes, setOrderTypes] = useState<OrderType>(blankOrderType);

    const { step, id } = useParams();

    useEffect(() => {
        if (id) {
            const db = firebase.firestore();
            db.collection("orders")
                .doc(id)
                .get()
                .then((doc) => {
                    if (!doc.exists) {
                        history.push("/");
                    } else {
                        const data = doc.data() as Order;
                        setData({ ...data } as OrderData);
                        setOrderTypes({ ...data.orderType });
                        setAssociations(
                            data.associations ?? [{ ...blankAssociation }]
                        );
                    }
                })
                .catch((err) => console.log("Order error", err))
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [history, id]);

    const basePath = `/update/${id}`;

    if (!step && !id) return <Redirect to="/" />;
    if (loading) return <CircularProgress />;
    if (!data || !orderTypes) return <Redirect to="/" />;

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
            component: <Step3 {...{ data }} orderType={orderTypes} />,
        },
    ];

    return (
        <FullScreenCreate
            cancelPath={`/order/${id}`}
            {...{ stepComponents }}
            activeStep={step}
            toolbarHeader="Create New Order"
        />
    );
};
