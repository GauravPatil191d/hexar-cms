"use client";

import {
    createContext,
    ReactNode,
    useCallback,
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

type BannerPayload = Omit<
    BannerData,
    "_id" | "banner_generated_id"
>;

interface BannerContextType {
    banners: BannerData[];
    isLoading: boolean;
    error: string | null;

    getBanners: () => Promise<void>;

    createBanner: (
        data: BannerPayload,
    ) => Promise<boolean>;

    updateBanner: (
        id: string,
        data: BannerPayload,
    ) => Promise<boolean>;

    deleteBanner: (
        id: string,
    ) => Promise<boolean>;
}

const BannerContext =
    createContext<BannerContextType | undefined>(
        undefined,
    );

/*
|--------------------------------------------------------------------------
| API ENDPOINTS
|--------------------------------------------------------------------------
*/

const GET_BANNERS_ENDPOINT =
    "/banners/get-all-banners";

const CREATE_BANNER_ENDPOINT =
    "/banners/upload-banner";

const UPDATE_BANNER_ENDPOINT =
    (id: string) =>
        `/banners/update-banner/${id}`;

/*
|--------------------------------------------------------------------------
| IMPORTANT
|--------------------------------------------------------------------------
|
| Your current request:
|
| DELETE /banners/delete-banner/:id
|
| returns 404.
|
| Change this endpoint to EXACTLY match your backend route.
|
| Example:
|
| router.delete("/delete/:id", ...)
|
| => "/banners/delete/:id"
|
*/

const DELETE_BANNER_ENDPOINT =
    (id: string) =>
        `/banners/delete/${id}`;

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

    /*
    |--------------------------------------------------------------------------
    | GET BANNERS
    |--------------------------------------------------------------------------
    */

    const getBanners =
        useCallback(async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response =
                    await axiosClient.get(
                        GET_BANNERS_ENDPOINT,
                    );

                const data =
                    response.data?.data;

                setBanners(
                    Array.isArray(data)
                        ? data
                        : [],
                );
            } catch (err: any) {
                console.error(
                    "Get banners error:",
                    err.response?.data ||
                    err.message,
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to fetch banners",
                );
            } finally {
                setIsLoading(false);
            }
        }, []);

    /*
    |--------------------------------------------------------------------------
    | CREATE BANNER
    |--------------------------------------------------------------------------
    */

    const createBanner =
        useCallback(
            async (
                data: BannerPayload,
            ): Promise<boolean> => {
                try {
                    setIsLoading(true);
                    setError(null);

                    const response =
                        await axiosClient.post(
                            CREATE_BANNER_ENDPOINT,
                            data,
                        );

                    const newBanner =
                        response.data?.data;

                    if (newBanner) {
                        setBanners(
                            (previousBanners) => [
                                newBanner,
                                ...previousBanners,
                            ],
                        );
                    } else {
                        await getBanners();
                    }

                    return true;
                } catch (err: any) {
                    console.error(
                        "Create banner error:",
                        err.response?.data ||
                        err.message,
                    );

                    setError(
                        err.response?.data?.message ||
                        "Unable to create banner",
                    );

                    return false;
                } finally {
                    setIsLoading(false);
                }
            },
            [getBanners],
        );

    /*
    |--------------------------------------------------------------------------
    | UPDATE BANNER
    |--------------------------------------------------------------------------
    */

    const updateBanner =
        useCallback(
            async (
                id: string,
                data: BannerPayload,
            ): Promise<boolean> => {
                try {
                    if (!id) {
                        throw new Error(
                            "Banner ID is missing.",
                        );
                    }

                    setIsLoading(true);
                    setError(null);

                    await axiosClient.put(
                        UPDATE_BANNER_ENDPOINT(id),
                        data,
                    );

                    setBanners(
                        (previousBanners) =>
                            previousBanners.map(
                                (banner) => {
                                    const bannerId =
                                        banner.banner_generated_id ||
                                        banner._id;

                                    if (
                                        bannerId === id
                                    ) {
                                        return {
                                            ...banner,
                                            ...data,
                                        };
                                    }

                                    return banner;
                                },
                            ),
                    );

                    return true;
                } catch (err: any) {
                    console.error(
                        "Update banner error:",
                        err.response?.data ||
                        err.message,
                    );

                    setError(
                        err.response?.data?.message ||
                        "Unable to update banner",
                    );

                    return false;
                } finally {
                    setIsLoading(false);
                }
            },
            [],
        );


    // DELETE BANNER

    const deleteBanner =
        useCallback(
            async (
                id: string,
            ): Promise<boolean> => {
                try {
                    if (!id) {
                        throw new Error(
                            "Banner ID is missing.",
                        );
                    }

                    setIsLoading(true);
                    setError(null);

                    await axiosClient.delete(
                        `/banners/delete-banner/${id}`,
                    );

                    setBanners((previousBanners) =>
                        previousBanners.filter(
                            (banner) => {
                                const bannerId =
                                    banner.banner_generated_id ||
                                    banner._id;

                                return bannerId !== id;
                            },
                        ),
                    );

                    return true;
                } catch (err: any) {
                    console.error(
                        "Delete banner error:",
                        err.response?.data ||
                        err.message,
                    );

                    setError(
                        err.response?.data?.message ||
                        "Unable to delete banner",
                    );

                    return false;
                } finally {
                    setIsLoading(false);
                }
            },
            [],
        );

    /*
    |--------------------------------------------------------------------------
    | INITIAL LOAD
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        getBanners();
    }, [getBanners]);

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