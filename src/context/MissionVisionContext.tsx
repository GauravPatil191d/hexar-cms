"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

import axiosClient from "@/utils/axiosClient";

export interface MissionVisionData {
    mission_vision_generated_id: string;

    background_video: string;

    mission_title: string;
    mission_description: string;

    vision_title: string;
    vision_description: string;
}

interface MissionVisionContextType {
    missionVision:
    MissionVisionData | null;

    loading: boolean;

    getMissionVision: () => Promise<void>;

    createMissionVision: (
        data: Omit<
            MissionVisionData,
            "mission_vision_generated_id"
        >,
    ) => Promise<boolean>;

    updateMissionVision: (
        mission_vision_generated_id: string,
        data: Omit<
            MissionVisionData,
            "mission_vision_generated_id"
        >,
    ) => Promise<boolean>;
}

const MissionVisionContext =
    createContext<
        MissionVisionContextType | undefined
    >(undefined);

export const MissionVisionProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [missionVision, setMissionVision] =
        useState<MissionVisionData | null>(
            null,
        );

    const [loading, setLoading] =
        useState(false);

    const getMissionVision =
        async () => {
            try {
                setLoading(true);

                const response =
                    await axiosClient.get(
                        "/mission-vision/get-mission-vision",
                    );

                setMissionVision(
                    response.data.data,
                );
            } catch (error) {
                setMissionVision(null);
            } finally {
                setLoading(false);
            }
        };

    const createMissionVision =
        async (
            data: Omit<
                MissionVisionData,
                "mission_vision_generated_id"
            >,
        ) => {
            try {
                setLoading(true);

                const response =
                    await axiosClient.post(
                        "/mission-vision/create-mission-vision",
                        data,
                    );

                setMissionVision(
                    response.data.data,
                );

                return true;
            } catch (error) {
                return false;
            } finally {
                setLoading(false);
            }
        };

    const updateMissionVision =
        async (
            mission_vision_generated_id: string,

            data: Omit<
                MissionVisionData,
                "mission_vision_generated_id"
            >,
        ) => {
            try {
                setLoading(true);

                const response =
                    await axiosClient.put(
                        `/mission-vision/update-mission-vision/${mission_vision_generated_id}`,
                        data,
                    );

                setMissionVision(
                    response.data.data,
                );

                return true;
            } catch (error) {
                return false;
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        getMissionVision();
    }, []);

    return (
        <MissionVisionContext.Provider
            value={{
                missionVision,

                loading,

                getMissionVision,

                createMissionVision,

                updateMissionVision,
            }}
        >
            {children}
        </MissionVisionContext.Provider>
    );
};

export const useMissionVision = () => {
    const context =
        useContext(MissionVisionContext);

    if (!context) {
        throw new Error(
            "useMissionVision must be used inside MissionVisionProvider",
        );
    }

    return context;
};