import {createContext} from 'react';
import { User } from '../Interfaces';

export const UserContext =  createContext<User | null>(null);