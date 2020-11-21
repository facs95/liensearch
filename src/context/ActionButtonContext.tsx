import { createContext } from "react";
import { User } from "../Interfaces";

export interface ActionButtonInterface {
    label: string; 
    action: () => void
}

interface ActionButtonContextInterface {
    actionButton: ActionButtonInterface | null;
    setActionButton: React.Dispatch<React.SetStateAction<ActionButtonInterface | null>>
}

export const ActionButtonContext = createContext<ActionButtonContextInterface>({
    actionButton: null,
    setActionButton: () => {}
 });
