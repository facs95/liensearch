import React, { useState, useContext } from "react";
import { CreateWrapper } from "../../components/CreateWrapper";
import * as firebase from "firebase/app";
import { OrderType, OrderData, CreateOrder } from "../../Interfaces";
import { UserContext } from "../../context/UserContext";
import { DisplayOrder } from "../../components/DisplayOrder";

interface Props {
    data: OrderData;
    orderType: OrderType;
}

export const Step3 = ({ data, orderType }: Props) => {
    const [loading, setLoading] = useState(false);

    const userData = useContext(UserContext);

    const db = firebase.firestore();

    const order: CreateOrder = {
        ...data,
        orderType,
        requestedBy:  userData?.uid || "",
        orgId: userData?.orgId || "",
        created_on: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    };

    const onSubmit = async () => {
        setLoading(true);
        try {
            await db.collection("orders").add(order);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const content = (
        <>
            <DisplayOrder {...{order}} type="create" />
        </>
    );

    return (
        <CreateWrapper
            {...{ content }}
            isLast
            onNext={onSubmit}
            disabled={loading}
        />
    );
};
