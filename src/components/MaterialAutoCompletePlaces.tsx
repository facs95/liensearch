import React, { useEffect, useRef } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import { Address } from "../Interfaces";

function loadScript(src: string, position: HTMLElement | null, id: string) {
    if (!position) {
        return;
    }

    const script = document.createElement("script");
    script.setAttribute("async", "");
    script.setAttribute("id", id);
    script.src = src;
    position.appendChild(script);
}

const autocompleteService = { current: null };

const useStyles = makeStyles((theme) => ({
    icon: {
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(2),
    },
}));

interface PlaceType {
    place_id: string;
    description: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
        main_text_matched_substrings: [
            {
                offset: number;
                length: number;
            }
        ];
    };
    terms: {
        offest: number;
        value: string;
    }[];
}

interface Props {
    setAddress: React.Dispatch<React.SetStateAction<Address>>;
}

export default function MaterialAutoCompletePlaces({ setAddress }: Props) {
    const classes = useStyles();
    const [value, setValue] = React.useState<PlaceType | null>(null);
    const [inputValue, setInputValue] = React.useState("");
    const [options, setOptions] = React.useState<PlaceType[]>([]);
    const loaded = React.useRef(false);

    if (typeof window !== "undefined" && !loaded.current) {
        if (!document.querySelector("#google-maps")) {
            loadScript(
                "https://maps.googleapis.com/maps/api/js?key=AIzaSyAeY0GFcfe3m5Q3fC1ZVTAAJedkaGxpZlo&libraries=places&callback=initMap",
                document.querySelector("head"),
                "google-maps"
            );
        }

        loaded.current = true;
    }

    const geocoderInstance = useRef<any | null>(null);

    useEffect(() => {
        if (value && geocoderInstance.current) {
            geocoderInstance.current?.geocode(
                { placeId: value!.place_id },
                (results: any, status: any) => {
                    if (results) {
                        const address = results[0].address_components;
                        const streeNumber = address.find(
                            (ad: any) => ad.types[0] === "street_number"
                        )?.long_name ?? '';
                        const street = address.find(
                            (ad: any) => ad.types[0] === "route"
                        )?.long_name ?? '';
                        const city = address.find(
                            (ad: any) => ad.types[0] === "locality"
                        )?.long_name ?? '';
                        const state = address.find(
                            (ad: any) =>
                                ad.types[0] === "administrative_area_level_1"
                        )?.short_name ?? '';
                        const zipCode = address.find(
                            (ad: any) => ad.types[0] === "postal_code"
                        )?.long_name ?? '';
                        const add: Address = {
                            address1: `${streeNumber} ${street}`,
                            city,
                            state,
                            zipCode,
                        };
                        setAddress(add);
                    }
                }
            );
        }
    }, [value, setAddress]);

    const fetch = React.useMemo(
        () =>
            throttle(
                (
                    request: {
                        input: string;
                        componentRestrictions: any;
                    },
                    callback: (results?: PlaceType[]) => void
                ) => {
                    (autocompleteService.current as any).getPlacePredictions(
                        request,
                        callback
                    );
                },
                200
            ),
        []
    );

    React.useEffect(() => {
        let active = true;

        if (!geocoderInstance.current && (window as any).google) {
            console.log("here");
            geocoderInstance.current = new (window as any).google.maps.Geocoder();
        }
        if (!autocompleteService.current && (window as any).google) {
            autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
        }
        if (!autocompleteService.current) {
            return undefined;
        }

        if (inputValue === "") {
            setOptions(value ? [value] : []);
            return undefined;
        }

        fetch(
            {
                input: inputValue,
                componentRestrictions: {
                    country: "us",
                },
            },
            (results?: PlaceType[]) => {
                if (active) {
                    let newOptions = [] as PlaceType[];

                    if (value) {
                        newOptions = [value];
                    }

                    if (results) {
                        newOptions = [...newOptions, ...results];
                    }

                    setOptions(newOptions);
                }
            }
        );

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch]);

    return (
        <Autocomplete
            fullWidth
            id="google-map-demo"
            getOptionLabel={(option) =>
                typeof option === "string" ? option : option.description
            }
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            onChange={(event: any, newValue: PlaceType | null) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Add a location"
                    variant="outlined"
                    fullWidth
                />
            )}
            renderOption={(option) => {
                const matches =
                    option.structured_formatting.main_text_matched_substrings;
                const parts = parse(
                    option.structured_formatting.main_text,
                    matches.map((match: any) => [
                        match.offset,
                        match.offset + match.length,
                    ])
                );

                return (
                    <Grid container alignItems="center">
                        <Grid item>
                            <LocationOnIcon className={classes.icon} />
                        </Grid>
                        <Grid item xs>
                            {parts.map((part, index) => (
                                <span
                                    key={index}
                                    style={{
                                        fontWeight: part.highlight ? 700 : 400,
                                    }}
                                >
                                    {part.text}
                                </span>
                            ))}
                            <Typography variant="body2" color="textSecondary">
                                {option.structured_formatting.secondary_text}
                            </Typography>
                        </Grid>
                    </Grid>
                );
            }}
        />
    );
}
