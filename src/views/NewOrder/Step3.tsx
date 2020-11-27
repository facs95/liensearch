import React, { useState, useContext } from "react";
import { CreateWrapper } from "../../components/CreateWrapper";
import firebase from "firebase/app";
import {
    OrderType,
    OrderData,
    CreateOrder,
    Address,
    LandSurveyDetails,
} from "../../Interfaces";
import { UserContext } from "../../context/UserContext";
import { DisplayOrder } from "../../components/DisplayOrder";
import { useHistory } from "react-router-dom";
import { Associations } from "./NewOrder";
import { Button, Grid } from "@material-ui/core";
import { EmptyState } from "../../components/EmpyState";

interface Props {
    data: OrderData;
    address: Address;
    landSurvey: LandSurveyDetails;
    associations: Associations;
    orderType: OrderType;
    id: string;
}

export const Step3 = ({
    data,
    associations,
    orderType,
    address,
    landSurvey,
    id,
}: Props) => {
    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);

    const userData = useContext(UserContext);
    const history = useHistory();

    const db = firebase.firestore();

    const order: CreateOrder = {
        ...data,
        address,
        landSurvey,
        associations,
        orderType,
        requestedBy: userData?.uid || "",
        orgId: userData?.orgId || "",
        created_on: Date.now(),
        status: "newOrder",
        assignee: "",
    };

    const onSubmit = async () => {
        setLoading(true);
        try {
            if (id) {
                await db.collection("orders").doc(id).update(order);
                history.push(`/order/${id}`);
            } else {
                await db.collection("orders").add(order);
                setOrderComplete(true);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const completeContent = (
        <EmptyState
            imageFile="complete.svg"
            title="Order Complete!"
            description="We are working on your oder"
            button={{
                text: "Go to dashboard",
                onClick: () => history.push("/"),
            }}
        />
    );
    const content = orderComplete ? (
        completeContent
    ) : (
        <DisplayOrder {...{ order }} type="create" />
    );

    return (
        <CreateWrapper
            {...{ content }}
            isLast
            onNext={onSubmit}
            disabled={loading}
            hideActions={orderComplete}
        />
    );
};
