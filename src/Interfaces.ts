import firebase from 'firebase/app';

export interface UserData {
    email: string
    name: string
    orgId: string
    phoneNumber: string
}

export interface OrdersStats {
    count: number
}
export interface OrderType {
    lienSearch:  boolean
    estoppelLetter: boolean
    landSurvey: boolean
    permitResolution: boolean
}

export type  Associations = Array<{name: string, number: string}>

export enum OrderTypeEnum {
    lienSearch = 'Lien Search',
    estoppelLetter = 'Estoppel Letter',
    landSurvey = 'Land Survey',
    permitResolution = 'Permit Resolution'
};

export enum OrderStatusEnum {
    newOrder = 'New Order',
    hold = 'Hold',
    informationRequested = 'Information Requested',
    informationReceived = 'Information Received', // Esto deberia sobrar
    pendingPayment = 'Pending Payment',
    cancelled = 'Cancelled',
    finalized = 'Finalized'
}

export type orderStatusEnumKeys = keyof typeof OrderStatusEnum;

export type orderTypeEnumKeys =  keyof typeof OrderTypeEnum


export interface OrderData {
    address: {
        address1: string
        address2: string
        unit: string
        city: string
        state: string
        zipCode: string
    }
    orderNumber: string
    specialInstructions: string
    folio: number
    legalDescription: string
    requestedBy?: string
    closingDate: string
    neededDate: string
    seller: string
    buyer: string
    listingAgent?: string
    listingAgentPhone?: number
    landSurvey?: {
        lenderCertification: string
        buyerCertification: string
        underwriterCertification: string
        titleCompany: string
        hardCopy: boolean
    }
}

export interface CreateOrder extends OrderData {
    orgId: string
    orderType: OrderType
    associations?: Associations
    created_on: firebase.firestore.Timestamp
    status: orderStatusEnumKeys
}

export interface Order extends CreateOrder, OrderStatus {
    id: string
    orderNumber: string
}

export interface OrderStatus {
    assignee: string
}

export interface OrgData {
    name: string;
    users: string[];
}

export interface Org extends OrgData {
    id: string
}