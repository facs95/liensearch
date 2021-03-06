import React, { useState, useEffect } from "react";
import { FullScreenCreate } from "../../components/FullScreenCreate";
import { Step3 } from "./Step3";
import { Step1 } from "./Step1";
import { useParams, Redirect, useHistory } from "react-router-dom";
import {
    OrderTypesInterface,
    OrderData,
    Address,
    LandSurveyDetails,
    Order,
    emptyOrdersType,
} from "../../Interfaces";
import firebase from "firebase/app";
import { CreateOrderForm } from "../../components/CreateOrderForm";
import { CircularProgress } from "@material-ui/core";
import { destructureOrder } from "../../utils/orders";
import { extend } from "lodash";

const blankAddress: Address = {
    address1: "",
    address2: "",
    unit: "",
    city: "",
    state: "",
    zipCode: "",
};

const bankLandSurvey: LandSurveyDetails = {
    lenderCertification: "",
    buyerCertification: "",
    underwriterCertification: "",
    titleCompany: "",
    hardCopy: false,
};

const blankData: OrderData = {
    orderNumber: "",
    specialInstructions: "",
    folio: 0,
    orgName: "",
    legalDescription: "",
    closingDate: new Date().toLocaleDateString(),
    neededDate: new Date().toLocaleDateString(),
    seller: "",
    buyer: "",
    listingAgent: "",
    listingAgentPhone: 0,
};

export type Associations = Array<{ name: string; number: string }>;

export const blankAssociation = { name: "", number: "" };

interface locationState {
    preOrderType: OrderTypesInterface;
    data: OrderData;
    associations: Associations;
}

export const NewOrder = () => {
    const history = useHistory<locationState>();

    const {
        location: {
            state: {
                preOrderType,
                data: preData,
                associations: preAssocations,
            } = {
                preOrderType: null,
                data: null,
                associations: [{ ...blankAssociation }],
            },
        },
    } = history;

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<OrderData>(preData || blankData);
    const [address, setAddress] = useState<Address>(blankAddress);
    const [landSurvey, setLandSurvey] = useState<LandSurveyDetails>(
        bankLandSurvey
    );
    const [associations, setAssociations] = useState<Associations>(
        preAssocations || [{ ...blankAssociation }]
    );

    const [orderTypes, setOrderTypes] = useState<OrderTypesInterface>({
        ...(preOrderType || emptyOrdersType),
    });

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
                        const {
                            orderData,
                            orderType,
                            associations,
                            address,
                            landSurvey,
                        } = destructureOrder(data);
                        setData(orderData as OrderData);
                        setOrderTypes(orderType);
                        setAssociations((c) => {
                            if (associations) {
                                return extend(associations);
                            }
                            return [blankAssociation];
                        });
                        setAddress(address);
                        setLandSurvey((c) => {
                            if (landSurvey) {
                                return extend(c, landSurvey);
                            }
                            return bankLandSurvey;
                        });
                    }
                })
                .catch((err) => console.log("Order error", err))
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [history, id]);

    const basePath = id ? `/update/${id}` : "/new-order";
    const cancelPath = id ? `/order/${id}` : "/";
    if (loading) return <CircularProgress />;
    if (!step) return <Redirect to="/" />;

    const stepComponents = [
        {
            label: "Type of Order",
            component: (
                <Step1
                    {...{ basePath }}
                    {...{ orderTypes }}
                    {...{ setOrderTypes }}
                />
            ),
        },
        {
            label: "Property Information",
            component: (
                <CreateOrderForm
                    {...{ address }}
                    {...{ setAddress }}
                    {...{ setData }}
                    {...{ setAssociations }}
                    {...{ associations }}
                    {...{ setLandSurvey }}
                    {...{ landSurvey }}
                    {...{ orderTypes }}
                    {...{ data }}
                    {...{ basePath }}
                />
            ),
        },
        {
            label: "Confirm Order",
            component: (
                <Step3
                    {...{ address }}
                    {...{ landSurvey }}
                    {...{ associations }}
                    {...{ id }}
                    {...{ data }}
                    orderType={orderTypes}
                />
            ),
        },
    ];

    return (
        <FullScreenCreate
            cancelPath={cancelPath}
            {...{ stepComponents }}
            activeStep={step}
            toolbarHeader="Create New Order"
        />
    );
};
