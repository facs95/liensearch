import React, { useEffect } from "react";
import { Grid, Typography, Divider } from "@material-ui/core";
import { LandSurveyDetailsEnum, LandSurveyDetails } from "../Interfaces";
import { InputGenerator } from "./InputGenerator";
interface Props {
    landSurvey: LandSurveyDetails;
    setLandSurvey: React.Dispatch<React.SetStateAction<LandSurveyDetails>>;
    setIsLandSurveyReady: React.Dispatch<
        React.SetStateAction<boolean>
    >;
}

interface InputList {
    label: string;
    key: keyof LandSurveyDetails;
    isNotRequired?: boolean;
    xs?: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    md?: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    isBoolean?: boolean;
}

export const LandSurveyForm = ({
    landSurvey,
    setLandSurvey,
    setIsLandSurveyReady,
}: Props) => {
    const inputList: InputList[] = [
        {
            label: LandSurveyDetailsEnum["lenderCertification"],
            key: "lenderCertification",
            xs: 12,
            md: 6,
        },
        {
            label: LandSurveyDetailsEnum["buyerCertification"],
            key: "buyerCertification",
            xs: 12,
            md: 6,
        },
        {
            label: LandSurveyDetailsEnum["underwriterCertification"],
            key: "underwriterCertification",
            xs: 12,
            md: 6,
        },
        {
            label: LandSurveyDetailsEnum["titleCompany"],
            key: "titleCompany",
            xs: 12,
            md: 6,
        },
        {
            label: LandSurveyDetailsEnum["hardCopy"],
            key: "hardCopy",
            xs: 12,
            md: 6,
            isBoolean: true,
        },
    ];

    useEffect(() => {
        const isReady = !inputList.some(
            (item) => item.key !== 'hardCopy' && !item.isNotRequired && !landSurvey[item.key]
        );
        setIsLandSurveyReady(isReady);
    }, [inputList, landSurvey, setIsLandSurveyReady]);

    return (
        <>
            <Grid item>
                <Typography variant="h6">Land Survey</Typography>
                <Divider />
            </Grid>
            <Grid item container spacing={2}>
                {inputList.map((item, index) => (
                    <Grid key={`data-${index}`} item xs={item.xs} md={item.md}>
                        <InputGenerator
                            name={item.key}
                            isNotRequired={item.isNotRequired}
                            value={landSurvey[item.key] ?? ""}
                            setter={setLandSurvey}
                            label={item.label}
                            isBoolean={item.isBoolean}
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};
