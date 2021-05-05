import React, {
    useState,
    useContext,
    useMemo,
    useCallback,
    useEffect,
} from "react";
import { CreateWrapper } from "../../components/CreateWrapper";
import firebase from "firebase/app";
import {
    OrderTypesInterface,
    OrderData,
    CreateOrder,
    Address,
    LandSurveyDetails,
} from "../../Interfaces";
import { UserContext } from "../../context/UserContext";
import { DisplayOrder } from "../../components/DisplayOrder";
import { useHistory } from "react-router-dom";
import { Associations } from "./NewOrder";
import { EmptyState } from "../../components/EmpyState";

interface Props {
    data: OrderData;
    address: Address;
    landSurvey: LandSurveyDetails;
    associations: Associations;
    orderType: OrderTypesInterface;
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
    const [orgName, setOrgName] = useState("");

    const userData = useContext(UserContext);
    const history = useHistory();

    const db = firebase.firestore();

    const getOrgName = useCallback(async () => {
        setLoading(true);
        try {
            const db = firebase.firestore();
            if (userData) {
                const orgDoc = await db
                    .collection("organizations")
                    .doc(userData.orgId)
                    .get();
                if (orgDoc.exists) {
                    const data = orgDoc.data();
                    if (data) {
                        setOrgName(data.name as string);
                    }
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, [userData]);

    useEffect(() => {
        getOrgName();
    }, [getOrgName]);

    const order = useMemo(() => {
        let o: CreateOrder = {
            ...data,
            address,
            orderType,
            requestedBy: userData?.uid || "",
            requestedByEmail: userData?.email || "",
            orgId: userData?.orgId || "",
            orgName: orgName,
            created_on: Date.now(),
            status: "inProgress",
            taskList: [],
        };
        if (orderType.landSurvey.isActive) {
            o.landSurvey = landSurvey;
        }
        if (orderType.estoppelLetter.isActive) {
            o.associations = associations;
        }
        return o;
    }, [data, landSurvey, associations, orderType, address, userData, orgName]);

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
