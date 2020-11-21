import { createContext } from "react";

interface SnackContextInterface {
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    setMessageType: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
}

export const SnackContext = createContext<SnackContextInterface>({
    setMessage: () => {},
    setMessageType: () => {},
});
