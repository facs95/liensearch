import { createContext } from "react";

export interface ActionButtonInterface {
    label: string; 
    action: () => void
    breadcrumbText?: number | string
}

interface ActionButtonContextInterface {
    actionButton: ActionButtonInterface | null;
    setNavigationBar: React.Dispatch<React.SetStateAction<ActionButtonInterface | null>>
}

export const ActionButtonContext = createContext<ActionButtonContextInterface>({
    actionButton: null,
    setNavigationBar: () => {}
 });
