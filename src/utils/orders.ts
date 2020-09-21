
import { Order } from "../Interfaces";
import { includes, pickBy } from "lodash";

export const destructureOrder = (data: Order) => {
    const orderData = pickBy(data, (_, key) =>
        !includes(["address", "orderType", "associations"], key)
    );
    const address = data.address;
    const orderType = data.orderType;
    const associations = data.associations;
    const landSurvey = data.landSurvey;
    return {
        address,
        orderType,
        orderData,
        associations,
        landSurvey
    };
};
