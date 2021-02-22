import React from "react";
import { CreateWrapper } from "../../components/CreateWrapper";
import { Grid, Typography, Divider } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { OrderTypesInterface } from "../../Interfaces";
import { OrderCard } from "../../components/OrderCard";

interface Props {
    basePath: string;
    orderTypes: OrderTypesInterface;
    setOrderTypes: React.Dispatch<React.SetStateAction<OrderTypesInterface>>;
}
export const Step1 = ({ basePath, orderTypes, setOrderTypes }: Props) => {
    const history = useHistory();

    const onNext = () => {
        history.push(`${basePath}/2`, {
            preOrderType: orderTypes,
        });
    };

    const typeCards: {
        name: keyof OrderTypesInterface;
        label: string;
        selected: boolean;
        description: string;
    }[] = [
        {
            name: "lienSearch",
            label: "Lien Search",
            selected: orderTypes.lienSearch.isActive,
            description: "Lorep ilsum Lorep ilsumLorep ilsumLorep ilsum",
        },
        {
            name: "estoppelLetter",
            label: "Estoppel Letter",
            selected: orderTypes.estoppelLetter.isActive,
            description: "Lorep ilsum Lorep ilsumLorep ilsumLorep ilsum",
        },
        {
            name: "landSurvey",
            label: "Land Survey",
            selected: orderTypes.landSurvey.isActive,
            description: "Lorep ilsum Lorep ilsumLorep ilsumLorep ilsum",
        },
        {
            name: "permitResolution",
            label: "Permit Resolution",
            selected: orderTypes.permitResolution.isActive,
            description: "Lorep ilsum Lorep ilsumLorep ilsumLorep ilsum",
        },
    ];

    const handleDataChange = (type: keyof OrderTypesInterface) => {
        setOrderTypes((c) => {
            let curr = { ...c };
            curr[type].isActive = !c[type].isActive;
            return curr;
        });
    };

    const content = (
        <Grid container direction="column" spacing={2}>
            <Grid item>
                <Typography variant="h6">Select Type of Order</Typography>
                <Divider />
            </Grid>
            <Grid item>
                <Typography variant="body1">
                    You can select multiple order types for the same property
                </Typography>
            </Grid>
            <Grid item container spacing={2}>
                {typeCards.map((type, index) => (
                    <Grid
                        key={`type-${index}`}
                        item
                        xs={6}
                        md={3}
                        onClick={() => handleDataChange(type.name)}
                    >
                        <OrderCard
                            type={type.name}
                            selected={orderTypes[type.name].isActive}
                        />
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );

    return (
        <CreateWrapper
            {...{ content }}
            isFirst
            {...{ onNext }}
            disabled={!typeCards.find((card) => card.selected)}
        />
    );
};
