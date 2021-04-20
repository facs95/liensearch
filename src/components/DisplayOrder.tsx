import React, { useContext, useState, useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import {
    Order,
    OrderData,
    Org,
    CreateOrder,
    LandSurveyDetails,
} from "../Interfaces";
import { UserContext } from "../context/UserContext";
import firebase from "firebase";
import {
    AccordionContentInterface,
    CustomAccordion,
    CustomAccordionProps,
} from "./CutomAccordion";
import { getAddressStr } from "../utils/orders";

interface Props {
    order: Order | CreateOrder;
    type: "create" | "info";
}

const orderInfoText = new Map<keyof OrderData, string>([
    ["folio", "Folio"],
    ["legalDescription", "legal Description"],
    ["closingDate", "Closing Date"],
    ["neededDate", "Needed Date"],
    ["seller", "Seller"],
    ["buyer", "Buyer"],
    ["listingAgent", "Listing Agent"],
    ["listingAgentPhone", "Listing Agent Phone"],
    ["specialInstructions", "Special Instructions"],
]);

const landSurveyDetailsText = new Map<keyof LandSurveyDetails, string>([
    ["buyerCertification", "Buyer Certification"],
    ["lenderCertification", "Lender Certification"],
    ["titleCompany", "Title Company"],
    ["underwriterCertification", "Underwriter Certficiation"],
]);

const orderDetails: Array<keyof OrderData> = [
    "folio",
    "closingDate",
    "neededDate",
    "buyer",
    "listingAgent",
    "listingAgentPhone",
    "legalDescription",
    "specialInstructions",
];

const landSurveyDetails: Array<keyof LandSurveyDetails> = [
    "buyerCertification",
    "lenderCertification",
    "titleCompany",
    "underwriterCertification",
];

export const DisplayOrder = ({ order, type }: Props) => {
    const userData = useContext(UserContext);
    const db = firebase.firestore();

    const [org, setOrg] = useState<Org | null>(null);
    const [requestedBy, setRequestedBy] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (order.orgId) {
            db.collection("organizations")
                .doc(order.orgId)
                .get()
                .then((doc) => {
                    if (!doc.exists) setOrg(null);
                    setOrg(doc.data() as Org);
                })
                .catch((err) => console.log(err))
                .finally(() => setLoading(false));
        } else {
            setOrg(null);
            setLoading(false);
        }
    }, [order, db]);

    useEffect(() => {
        if (type === "info" && order.requestedBy) {
            db.collection("users")
                .doc(order.requestedBy)
                .get()
                .then((doc) => {
                    if (!doc.exists) setRequestedBy(null);
                    setRequestedBy(doc.data()?.email ?? ("" as string));
                })
                .catch((err) => console.log("here", err))
                .finally(() => setLoading(false));
        } else {
            setRequestedBy(userData?.email ?? "");
        }
    }, [order, type, db, userData]);

    const displayInfo: () => AccordionContentInterface[] = () => {
        return orderDetails.map((detail) => {
            if (detail === "closingDate" || detail === "neededDate") {
                return {
                    subHeader: orderInfoText.get(detail) ?? "",
                    value: new Date(order[detail]).toDateString() || "--",
                };
            }
            return {
                subHeader: orderInfoText.get(detail) ?? "",
                value: order[detail] || "--",
            };
        });
    };

    const getLandSurveyInfo: () => AccordionContentInterface[] = () => {
        const details = landSurveyDetails.map((detail) => ({
            subHeader: landSurveyDetailsText.get(detail) ?? "",
            value: order.landSurvey![detail] || "--",
        }));
        const hardCopy = {
            subHeader: "Include Hard Copy",
            value: order.landSurvey!.hardCopy ? <CheckIcon /> : <CloseIcon />,
        };
        return [...details, hardCopy];
    };

    if (loading) return <></>;

    const accordions: CustomAccordionProps[] = [
        {
            header: "Order Details",
            defaultExpanded: true,
            content: [
                {
                    subHeader: "Property Address",
                    value: getAddressStr(order.address),
                },
                {
                    subHeader: "Requested By User",
                    value: requestedBy ?? "No user Found",
                },
                {
                    subHeader: "Requested By Organization",
                    value: org ? org.name : "No Company Found",
                },
                ...displayInfo(),
            ],
        },
    ];

    if (order.orderType.landSurvey.isActive) {
        accordions.push({
            header: "Land Survey Info",
            content: getLandSurveyInfo(),
        });
    }

    return (
        <>
            {accordions.map((accordion, index) => (
                <CustomAccordion
                    defaultExpanded={accordion.defaultExpanded}
                    key={`displayOrder-${index}`}
                    header={accordion.header}
                    content={accordion.content}
                />
            ))}
        </>
    );
};
