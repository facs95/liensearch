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

interface Props {
    data: OrderData;
    address: Address;
    landSurvey: LandSurveyDetails;
    associations: Associations
    orderType: OrderType;
    id: string;
}

export const Step3 = ({ data, associations, orderType, address, landSurvey, id }: Props) => {
    const [loading, setLoading] = useState(false);

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

    console.log(order)

    const onSubmit = async () => {
        setLoading(true);
        try {
            if (id) {
                await db.collection("orders").doc(id).update(order);
                history.push(`/order/${id}`);
            } else {
                await db.collection("orders").add(order);
                history.push("/");
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const content = <DisplayOrder {...{ order }} type="create" />;

    return (
        <CreateWrapper
            {...{ content }}
            isLast
            onNext={onSubmit}
            disabled={loading}
        />
    );
};
