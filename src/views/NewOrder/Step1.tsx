import React from "react";
import { CreateWrapper } from "../../components/CreateWrapper";
import { Grid, Typography, makeStyles, Divider } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { OrderType } from "../../Interfaces";
import { OrderCard } from "../../components/OrderCard";

interface Props {
    basePath: string;
    orderTypes: OrderType;
    setOrderTypes: React.Dispatch<React.SetStateAction<OrderType>>;
}
export const Step1 = ({ basePath, orderTypes, setOrderTypes }: Props) => {
    const classes = useStyles();
    const history = useHistory();

    const onNext = () => {
        history.push(`${basePath}/2`, {
            orderType: orderTypes,
        });
    };

    const typeCards: {
        name: keyof OrderType;
        label: string;
        selected: boolean;
        description: string;
    }[] = [
        {
            name: "lienSearch",
            label: "Lien Search",
            selected: orderTypes.lienSearch,
            description: "Lorep ilsum Lorep ilsumLorep ilsumLorep ilsum",
        },
        {
            name: "estoppelLetter",
            label: "Estoppel Letter",
            selected: orderTypes.estoppelLetter,
            description: "Lorep ilsum Lorep ilsumLorep ilsumLorep ilsum",
        },
        {
            name: "landSurvey",
            label: "Land Survey",
            selected: orderTypes.landSurvey,
            description: "Lorep ilsum Lorep ilsumLorep ilsumLorep ilsum",
        },
        {
            name: "permitResolution",
            label: "Permit Resolution",
            selected: orderTypes.permitResolution,
            description: "Lorep ilsum Lorep ilsumLorep ilsumLorep ilsum",
        },
    ];

    const handleDataChange = (type: keyof OrderType) => {
        setOrderTypes((c) => {
            let curr = { ...c };
            curr[type] = !curr[type];
            return curr;
        });
    };

    const content = (
        <>
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
                            selected={orderTypes[type.name]}
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    );

    return <CreateWrapper {...{ content }} isFirst {...{ onNext }} />;
};

const useStyles = makeStyles((theme) => ({
    cardSelected: {
        border: "solid",
        borderColor: theme.palette.primary.main,
    },
}));
