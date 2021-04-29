import React, { useEffect, useRef, useState } from "react";

export function useLocalStorage<T>(
    key: string,
    defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState(() => {
        const valueInLocalStorage = window.localStorage.getItem(key);
        if (valueInLocalStorage) {
            return JSON.parse(valueInLocalStorage);
        }
        return typeof defaultValue === "function"
            ? defaultValue()
            : defaultValue;
    });

    const prevKeyRef = useRef(key);

    useEffect(() => {
        const prevKey = prevKeyRef.current;
        if (prevKey !== key) {
            window.localStorage.removeItem(prevKey);
            setState(defaultValue);
        }
        prevKeyRef.current = key;
        window.localStorage.setItem(key, JSON.stringify(state));
    }, [state, key, defaultValue]);

    return [state, setState];
}
