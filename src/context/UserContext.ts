import {createContext, useContext} from 'react';
import { User } from '../Interfaces';

export const UserContext =  createContext<User | null>(null);


export const useUser = () => {
    const user = useContext(UserContext);
    if (!user) {
        throw new Error("This context should only be used under AppWrapper");
    }
    return user;
}