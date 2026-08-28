"use client";

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

import axiosClient from "@/utils/axiosClient";

export interface BannerData {
    _id?: string;
    banner_generated_id?: string;
    banner_title: string;
    banner_small_tag: string;
    banner_image: string;
    banner_video: string;
}

interface BannerContextType {
    banners: BannerData[];
    isLoading: boolean;
    error: string | null;

    getBanners: () => Promise<void>;

    createBanner: (
        data: Omit<
            BannerData,
            "_id" | "banner_generated_id"
        >
    ) => Promise<boolean>;

    updateBanner: (
        id: string,
        data: Omit<
            BannerData,
            "_id" | "banner_generated_id"
        >
    ) => Promise<boolean>;

    deleteBanner: (
        id: string,
    ) => Promise<boolean>;
}

const BannerContext =
    createContext<BannerContextType | undefined>(
        undefined,
    );

export function BannerProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [banners, setBanners] =
        useState<BannerData[]>([]);

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const getBanners = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response =
                await axiosClient.get(
                    "/banners/get-all-banners",
                );

            const data = response.data.data;

            setBanners(
                Array.isArray(data)
                    ? data
                    : [],
            );
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Unable to fetch banners",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const createBanner = async (
        data: Omit<
            BannerData,
            "_id" | "banner_generated_id"
        >,
    ) => {
        try {
            setIsLoading(true);
            setError(null);

            const response =
                await axiosClient.post(
                    "/banners/upload-banner",
                    data,
                );

            const newBanner =
                response.data.data;

            setBanners((previousBanners) => [
                newBanner,
                ...previousBanners,
            ]);

            return true;
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Unable to create banner",
            );

            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const updateBanner = async (
        id: string,
        data: Omit<
            BannerData,
            "_id" | "banner_generated_id"
        >,
    ) => {
        try {
            setIsLoading(true);
            setError(null);

            await axiosClient.put(
                `/banners/update-banner/${id}`,
                data,
            );

            setBanners((previousBanners) =>
                previousBanners.map((banner) => {
                    if (
                        banner.banner_generated_id === id
                    ) {
                        return {
                            ...banner,
                            ...data,
                        };
                    }

                    return banner;
                }),
            );

            return true;
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Unable to update banner",
            );

            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteBanner = async (
        id: string,
    ) => {
        try {
            setIsLoading(true);
            setError(null);

            await axiosClient.delete(
                `/banners/delete-banner/${id}`,
            );

            setBanners((previousBanners) =>
                previousBanners.filter(
                    (banner) =>
                        banner.banner_generated_id !== id,
                ),
            );

            return true;
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Unable to delete banner",
            );

            return false;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getBanners();
    }, []);

    return (
        <BannerContext.Provider
            value={{
                banners,
                isLoading,
                error,
                getBanners,
                createBanner,
                updateBanner,
                deleteBanner,
            }}
        >
            {children}
        </BannerContext.Provider>
    );
}

export function useBanner() {
    const context =
        useContext(BannerContext);

    if (!context) {
        throw new Error(
            "useBanner must be used inside BannerProvider",
        );
    }

    return context;
}