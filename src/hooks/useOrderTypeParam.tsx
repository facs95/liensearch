import { useMemo } from "react";
import { useParams } from "react-router";
import { orderTypeEnumKeys } from "../Interfaces";
import {
    ESTOPPEL_LETTER_PATH,
    LAND_SURVEY_PATH,
    LIEN_SEARCH_PATH,
    PERMIT_RESOLUTION_PATH,
} from "../utils/constants";

export const urlToOrdertype = new Map<string, orderTypeEnumKeys>([
    [LIEN_SEARCH_PATH, "lienSearch"],
    [ESTOPPEL_LETTER_PATH, "estoppelLetter"],
    [LAND_SURVEY_PATH, "landSurvey"],
    [PERMIT_RESOLUTION_PATH, "permitResolution"],
]);

export const useOrderTypeParam = () => {
    const { orderType: orderTypeUrl } = useParams<{ orderType: string }>();

    const orderType = useMemo(() => {
        return urlToOrdertype.get(orderTypeUrl);
    }, [orderTypeUrl]);

    return orderType;
};
