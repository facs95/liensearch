import {createContext} from 'react';

export interface User {
    admin: boolean
}


export const UserContext =  createContext<User | null>(null);