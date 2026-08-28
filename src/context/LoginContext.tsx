"use client";

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

import axiosClient from "@/utils/axiosClient";

interface LoginContextType {
    token: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    loginError: string | null;

    login: (
        username: string,
        password: string,
    ) => Promise<boolean>;

    logout: () => void;
}

interface LoginResponse {
    success: boolean;
    message: string;

    data: {
        token: string;
    };
}

const LoginContext =
    createContext<LoginContextType | undefined>(
        undefined,
    );

export function LoginProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [token, setToken] =
        useState<string | null>(null);

    const [isLoading, setIsLoading] =
        useState(true);

    const [loginError, setLoginError] =
        useState<string | null>(null);

    useEffect(() => {
        const savedToken =
            localStorage.getItem("hexar_token");

        if (savedToken) {
            setToken(savedToken);
        }

        setIsLoading(false);
    }, []);

    const login = async (
        username: string,
        password: string,
    ) => {
        try {
            setLoginError(null);

            const response =
                await axiosClient.post<LoginResponse>(
                    "/auth/login",
                    {
                        username,
                        password,
                    },
                );

            const newToken =
                response.data.data.token;

            localStorage.setItem(
                "hexar_token",
                newToken,
            );

            setToken(newToken);

            return true;
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                "Login failed";

            setLoginError(message);

            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem(
            "hexar_token",
        );

        setToken(null);
        setLoginError(null);
    };

    return (
        <LoginContext.Provider
            value={{
                token,
                isLoggedIn: !!token,
                isLoading,
                loginError,
                login,
                logout,
            }}
        >
            {children}
        </LoginContext.Provider>
    );
}

export function useLogin() {
    const context =
        useContext(LoginContext);

    if (!context) {
        throw new Error(
            "useLogin must be used inside LoginProvider",
        );
    }

    return context;
}