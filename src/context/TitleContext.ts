import {createContext} from 'react';

interface context {
    title: string,
    setTitle: React.Dispatch<React.SetStateAction<string>>
}

export const TitleContext =  createContext<context>({
    title: '',
    setTitle: () => {}
});