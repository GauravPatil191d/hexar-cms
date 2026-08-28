"use client";

import {
    createContext,
    ReactNode,
    useContext,
    useState,
} from "react";

import axiosClient from "@/utils/axiosClient";

interface RibbonData {
    _id?: string;
    ribbon_generated_id: string;
    ribbon_text: string;
}

interface RibbonContextType {
    ribbon: RibbonData | null;
    isLoading: boolean;
    error: string | null;

    getRibbon: () => Promise<void>;

    createRibbon: (
        ribbon_text: string,
    ) => Promise<boolean>;

    updateRibbon: (
        ribbon_generated_id: string,
        ribbon_text: string,
    ) => Promise<boolean>;
}

const RibbonContext =
    createContext<RibbonContextType | undefined>(
        undefined,
    );

export function RibbonProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [ribbon, setRibbon] =
        useState<RibbonData | null>(null);

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const getRibbon = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response =
                await axiosClient.get(
                    "/ribbon/get-ribbon",
                );

            setRibbon(response.data.data);
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Unable to fetch ribbon",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const createRibbon = async (
        ribbon_text: string,
    ) => {
        try {
            setIsLoading(true);
            setError(null);

            const response =
                await axiosClient.post(
                    "/ribbon/create-ribbon",
                    {
                        ribbon_text,
                    },
                );

            setRibbon(response.data.data);

            return true;
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Unable to create ribbon",
            );

            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const updateRibbon = async (
        ribbon_generated_id: string,
        ribbon_text: string,
    ) => {
        try {
            setIsLoading(true);
            setError(null);

            await axiosClient.put(
                `/ribbon/update-ribbon/${ribbon_generated_id}`,
                {
                    ribbon_text,
                },
            );

            setRibbon((previousRibbon) => {
                if (!previousRibbon) {
                    return previousRibbon;
                }

                return {
                    ...previousRibbon,
                    ribbon_text,
                };
            });

            return true;
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Unable to update ribbon",
            );

            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <RibbonContext.Provider
            value={{
                ribbon,
                isLoading,
                error,
                getRibbon,
                createRibbon,
                updateRibbon,
            }}
        >
            {children}
        </RibbonContext.Provider>
    );
}

export function useRibbon() {
    const context =
        useContext(RibbonContext);

    if (!context) {
        throw new Error(
            "useRibbon must be used inside RibbonProvider",
        );
    }

    return context;
}