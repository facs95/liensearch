import * as firebase from 'firebase/app';

export interface OrderType {
    lienSearch: boolean
    estoppelLetter: boolean
    landSurvey: boolean
    permitResolution: boolean
}

export type  Associations = Array<{name: string, number: string}>

export interface OrderData {
    id: string
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

export interface Order extends OrderData {
    userId: string
    orderType: OrderType
    associations?: Associations
    created_on: firebase.firestore.Timestamp
}