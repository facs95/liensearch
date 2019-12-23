import {createContext} from 'react';

interface user {
    activeUser: any
}

export const UserContext =  createContext<any | null>(null);