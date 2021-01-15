import { TextField } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";


export const SearchPlacesInput = () => {
    const [input, setInput] = useState();

    const autoComplete = useMemo(() => {
        const autoComplete = new google.maps.places.Autocomplete(
            document.getElementById("autocomplete")! as HTMLInputElement,
            {}
        );
        if (autoComplete)
            autoComplete.addListener("place_changed", handlePlaceSelect);

        return autoComplete;
    }, []);

    function handlePlaceSelect() {
        let addressObject = autoComplete.getPlace();
        let address = addressObject.address_components;
        console.log(addressObject);
        console.log(address);
    }

    return (
        <input
            id="autocomplete"
            className="input-field"
            type="text"
        />
    );
};
