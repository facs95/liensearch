import {createContext} from 'react';

export interface User {
    uid: string
    admin: boolean
    orgId: string
    name: string
    phoneNumber: string
    email: string
}


export const UserContext =  createContext<User | null>(null);