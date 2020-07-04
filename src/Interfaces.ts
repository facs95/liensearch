import * as firebase from 'firebase/app';

export interface UserData {
    email: string
    name: string
    orgId: string
    phoneNumber: string
}
export interface OrderType {
    lienSearch: boolean
    estoppelLetter: boolean
    landSurvey: boolean
    permitResolution: boolean
}

export type  Associations = Array<{name: string, number: string}>


export enum OrderStatusEnum {
    newOrder = 'New Order',
    hold = 'Hold',
    informationRequested = 'Information Requested',
    informationReceived = 'Information Received', // Esto deberia sobrar
    pendingPayment = 'Pending Payment',
    cancelled = 'Cancelled',
    finalized = 'Finalized'
}

export type orderStatus = keyof typeof OrderStatusEnum;


export interface OrderData {
    address: {
        address1: string
        address2: string
        unit: string
        city: string
        state: string
        zipCode: string
    }
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
        survey: boolean,
        surveyCert: boolean
    }
}

export interface CreateOrder extends OrderData {
    orgId: string
    orderType: OrderType
    associations?: Associations
    created_on: firebase.firestore.Timestamp
}

export interface Order extends CreateOrder {
    id: string
}

export interface OrderStatus {
    status: orderStatus
    assignee: string
    documentPath: string
}

export interface Org {
    name: string;
    users: string[];
    id: string;
}