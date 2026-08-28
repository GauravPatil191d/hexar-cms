"use client";

import {
    createContext,
    ReactNode,
    useContext,
    useState,
} from "react";

import axiosClient from "@/utils/axiosClient";

interface AboutData {
    _id?: string;
    about_generated_id: string;
    about_title: string;
    about_image: string;
    about_description: string;
}

interface AboutContextType {
    about: AboutData | null;
    isLoading: boolean;
    error: string | null;

    getAbout: () => Promise<void>;

    createAbout: (
        about_title: string,
        about_image: string,
        about_description: string,
    ) => Promise<boolean>;

    updateAbout: (
        about_generated_id: string,
        about_title: string,
        about_image: string,
        about_description: string,
    ) => Promise<boolean>;
}

const AboutContext =
    createContext<AboutContextType | undefined>(
        undefined,
    );

export function AboutProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [about, setAbout] =
        useState<AboutData | null>(null);

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const getAbout = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response =
                await axiosClient.get(
                    "/about/get-about",
                );

            setAbout(response.data.data);
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Unable to fetch About section",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const createAbout = async (
        about_title: string,
        about_image: string,
        about_description: string,
    ) => {
        try {
            setIsLoading(true);
            setError(null);

            const response =
                await axiosClient.post(
                    "/about/create-about",
                    {
                        about_title,
                        about_image,
                        about_description,
                    },
                );

            setAbout(response.data.data);

            return true;
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Unable to create About section",
            );

            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const updateAbout = async (
        about_generated_id: string,
        about_title: string,
        about_image: string,
        about_description: string,
    ) => {
        try {
            setIsLoading(true);
            setError(null);

            await axiosClient.put(
                `/about/update-about/${about_generated_id}`,
                {
                    about_title,
                    about_image,
                    about_description,
                },
            );

            setAbout((previousAbout) => {
                if (!previousAbout) {
                    return previousAbout;
                }

                return {
                    ...previousAbout,
                    about_title,
                    about_image,
                    about_description,
                };
            });

            return true;
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Unable to update About section",
            );

            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AboutContext.Provider
            value={{
                about,
                isLoading,
                error,
                getAbout,
                createAbout,
                updateAbout,
            }}
        >
            {children}
        </AboutContext.Provider>
    );
}

export function useAbout() {
    const context =
        useContext(AboutContext);

    if (!context) {
        throw new Error(
            "useAbout must be used inside AboutProvider",
        );
    }

    return context;
}