import "date-fns";
import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { CreateWrapper } from "./CreateWrapper";
import { AssociationForm } from "./AssociationForm";
import { LandSurveyForm } from "./LandSurveryForm";
import { AddressForm } from "./OrderForms/AddressForm";
import { useHistory } from "react-router-dom";
import {
    Associations,
    OrderData,
    OrderTypesInterface,
    LandSurveyDetails,
    Address,
} from "../Interfaces";

import { DataForm } from "./OrderForms/DataForm";

interface Props {
    setData: React.Dispatch<React.SetStateAction<OrderData>>;
    setAssociations: React.Dispatch<React.SetStateAction<Associations>>;
    setLandSurvey: React.Dispatch<React.SetStateAction<LandSurveyDetails>>;
    setAddress: React.Dispatch<React.SetStateAction<Address>>;
    landSurvey: LandSurveyDetails;
    address: Address;
    associations: Associations;
    orderTypes: OrderTypesInterface;
    data: OrderData;
    basePath: string;
}

export const CreateOrderForm = ({
    basePath,
    setData,
    setAssociations,
    associations,
    orderTypes,
    address,
    setAddress,
    landSurvey,
    setLandSurvey,
    data,
}: Props) => {
    const history = useHistory();

    const [isAddressReady, setIsAddressReady] = useState(false);
    const [isDataReady, setIsDataReady] = useState(false);
    const [isAssociationsReady, setIsAssociationsReady] = useState(false);
    const [isLandSurveyReady, setIsLandSurveyReady] = useState(false);

    const onSubmit = () => {
        setData(data);
        history.push(`${basePath}/3`, {
            preOrderType: orderTypes,
            data,
            associations,
        });
    };

    const isReady =
        isAddressReady &&
        isDataReady &&
        (orderTypes.estoppelLetter.isActive ? isAssociationsReady : true) &&
        (orderTypes.landSurvey.isActive ? isLandSurveyReady : true);

    const content = (
        <Grid container direction="column" spacing={2}>
            <Grid item container spacing={2}>
                <Grid item container md={12} lg={6} spacing={2}>
                    <AddressForm
                        {...{ setIsAddressReady }}
                        {...{ address }}
                        {...{ setAddress }}
                    />
                </Grid>
                <Grid item container md={12} lg={6}>
                    <DataForm
                        {...{ setIsDataReady }}
                        orderData={data}
                        setOrderData={setData}
                    />
                </Grid>
            </Grid>
            <Grid item container spacing={2}>
                {orderTypes.estoppelLetter.isActive && (
                    <Grid
                        item
                        container
                        spacing={2}
                        md={12}
                        lg={orderTypes.landSurvey.isActive ? 6 : 12}
                        direction="column"
                        wrap="nowrap"
                    >
                        <AssociationForm
                            {...{ setIsAssociationsReady }}
                            {...{ setAssociations }}
                            {...{ associations }}
                        />
                    </Grid>
                )}
                {orderTypes.landSurvey.isActive && (
                    <Grid
                        item
                        container
                        spacing={2}
                        md={12}
                        lg={orderTypes.estoppelLetter.isActive ? 6 : 12}
                        wrap="nowrap"
                        direction="column"
                    >
                        <LandSurveyForm
                            {...{ setIsLandSurveyReady }}
                            {...{ landSurvey }}
                            {...{ setLandSurvey }}
                        />
                    </Grid>
                )}
            </Grid>
        </Grid>
    );

    return (
        <CreateWrapper {...{ content }} onNext={onSubmit} disabled={!isReady} />
    );
};
