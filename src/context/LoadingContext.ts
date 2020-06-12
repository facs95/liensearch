import {createContext} from 'react';

interface LoadingContext {
    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const LoadingContext = createContext<LoadingContext>({
    loading: false,
    setLoading: () => {}
});