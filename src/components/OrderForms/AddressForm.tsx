import React, { useEffect } from "react";
import { Address, AddressEnum } from "../../Interfaces";
import { InputGenerator } from "../InputGenerator";
import { Grid, Typography, Divider } from "@material-ui/core";

interface Props {
    address: Address;
    setAddress: React.Dispatch<React.SetStateAction<Address>>;
    setIsAddressReady: React.Dispatch<React.SetStateAction<boolean>>
}

interface InputList {
    label: string;
    key: keyof Address;
    isNotRequired?: boolean;
    xs?: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    md?: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    isNumber?: boolean;
}

export const AddressForm = ({ address, setAddress, setIsAddressReady }: Props) => {
    const inputList: InputList[] = [
        {
            label: AddressEnum["address1"],
            key: "address1",
            md: 6,
            xs: 12,
        },
        {
            label: AddressEnum["address2"],
            key: "address2",
            isNotRequired: true,
            md: 6,
            xs: 12,
        },
        {
            label: AddressEnum["unit"],
            key: "unit",
            isNotRequired: true,
            md: 3,
            xs: 12,
        },
        {
            label: AddressEnum["city"],
            key: "city",
            md: 3,
            xs: 12,
        },
        {
            label: AddressEnum["state"],
            key: "state",
            md: 3,
            xs: 12,
        },
        {
            label: AddressEnum["zipCode"],
            key: "zipCode",
            md: 3,
            xs: 12,
        },
    ];

    useEffect(() => {
        const isReady = inputList.some(item => !item.isNotRequired && !address[item.key] )
        setIsAddressReady(!isReady)
    }, [inputList, address, setIsAddressReady])

    return (
        <Grid item container spacing={2} xs={12} md={12} direction="column">
            <Grid item>
                <Typography variant="h6">Property Address</Typography>
                <Divider />
            </Grid>
            <Grid item container spacing={2}>
                {inputList.map((item, index) => (
                    <Grid key={`data-${index}`} item xs={item.xs} md={item.md}>
                        <InputGenerator
                            name={item.key}
                            isNotRequired={item.isNotRequired}
                            value={address[item.key] ?? ""}
                            setter={setAddress}
                            label={item.label}
                        />
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
};
