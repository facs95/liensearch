export interface UserData {
    email: string;
    name: string;
    orgId: string;
    phoneNumber: string;
}

export interface User extends UserData {
    uid: string;
    admin: boolean;
}

export interface OrdersStats {
    count: number;
}

export type Associations = Array<{ name: string; number: string }>;

export enum OrderStatusEnum {
    inProgress = "In Progress",
    finalized = "Finalized",
    cancelled = "Cancelled",
    hold = "Hold",
}

export enum OrderTypeEnum {
    lienSearch = "Lien Search",
    estoppelLetter = "Estoppel Letter",
    landSurvey = "Land Survey",
    permitResolution = "Permit Resolution",
}

export enum OrderTypeStatusEnum {
    newOrder = "New Order",
    hold = "Hold",
    informationRequested = "Information Requested",
    informationReceived = "Information Received", // Esto deberia sobrar
    pendingPayment = "Pending Payment",
    cancelled = "Cancelled",
    finalized = "Finalized",
}

export enum AddressEnum {
    address1 = "Address 1",
    address2 = "Address 2",
    unit = "Unit",
    city = "City",
    state = "State",
    zipCode = "Zip Code",
}

export enum OrderDataEnum {
    orderNumber = "Order # / File Name",
    folio = "Folio",
    legalDescription = "Legal Description",
    seller = "Seller",
    buyer = "Buyer",
    listingAgent = "Listing Agent",
    listingAgentPhone = "Listing Agent Phone",
    specialInstructions = "Special Instructions",
}

export enum LandSurveyDetailsEnum {
    lenderCertification = "Lender Certification",
    buyerCertification = "Buyer Certification",
    underwriterCertification = "Underwriter Certification",
    titleCompany = "Title Company",
    hardCopy = "Request Hard Copy",
}

export type orderStatusEnumKeys = keyof typeof OrderStatusEnum;

export type orderTypeStatusEnumKeys = keyof typeof OrderTypeStatusEnum;

export type orderTypeEnumKeys = keyof typeof OrderTypeEnum;

export const emptyOrderType: OrderTypeInterface = {
    isActive: false,
    status: "newOrder",
    assignee: "",
    estimatedDelivery: "",
};

export const emptyOrdersType: OrderTypesInterface = {
    lienSearch: { ...emptyOrderType },
    estoppelLetter: { ...emptyOrderType },
    landSurvey: { ...emptyOrderType },
    permitResolution: { ...emptyOrderType },
};

export interface OrderTypeInterface {
    isActive: boolean;
    status: orderTypeStatusEnumKeys;
    assignee: string;
    estimatedDelivery: string;
}
export interface OrderTypesInterface {
    lienSearch: OrderTypeInterface;
    estoppelLetter: OrderTypeInterface;
    landSurvey: OrderTypeInterface;
    permitResolution: OrderTypeInterface;
}

export interface Address {
    address1: string;
    address2?: string;
    unit?: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface LandSurveyDetails {
    lenderCertification: string;
    buyerCertification: string;
    underwriterCertification: string;
    titleCompany: string;
    hardCopy: boolean;
}

export interface OrderData {
    orderNumber: string;
    specialInstructions: string;
    folio: number;
    legalDescription: string;
    requestedBy?: string;
    requestedByEmail?: string;
    closingDate: string;
    neededDate: string;
    seller: string;
    buyer: string;
    listingAgent?: string;
    listingAgentPhone?: number;
}

export interface CreateOrder extends OrderData {
    orgId: string;
    orderType: OrderTypesInterface;
    associations?: Associations;
    landSurvey?: LandSurveyDetails;
    created_on: number;
    status: orderStatusEnumKeys;
    address: Address;
}

export interface Order extends CreateOrder {
    id: string;
    objectID: string; //for algolia
    orderCount: number;
}

export interface OrgData {
    name: string;
    users: string[];
    orderCount: number;
    phoneNumber: string;
    address: string;
}

export interface Org extends OrgData {
    id: string;
}

export interface Employee {
    id: string;
    email: string;
    name: string;
}
