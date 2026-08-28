"use client";

import React, { createContext, useContext, useState } from "react";

export interface BannerItem {
  id: string;
  title: string;
  smallTag: string;
  hoverImage: string;
  video: string;
}

export interface AboutUsData {
  title: string;
  image: string;
  description: string;
}

export interface MissionVisionData {
  backgroundVideo: string;
  missionTitle: string;
  missionDescription: string;
  visionTitle: string;
  visionDescription: string;
}

export type TabType = "dashboard" | "banner" | "ribbon" | "about-us" | "mission-vision";

interface CMSContextType {
  isAuthenticated: boolean;
  activeTab: TabType;
  loginError: string | null;
  banners: BannerItem[];
  ribbonText: string;
  aboutData: AboutUsData;
  missionVisionData: MissionVisionData;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  setActiveTab: (tab: TabType) => void;
  addBanner: (banner: Omit<BannerItem, "id">) => void;
  updateBanner: (id: string, banner: Omit<BannerItem, "id">) => void;
  deleteBanner: (id: string) => void;
  updateRibbonText: (text: string) => void;
  updateAboutData: (data: AboutUsData) => void;
  updateMissionVisionData: (data: MissionVisionData) => void;
}

const initialBanners: BannerItem[] = [
  {
    id: "banner-1",
    title: "Call of Duty",
    smallTag: "BLACK OPS 7",
    hoverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
    video: "https://assets.mixkit.co/videos/preview/mixkit-cyber-punk-city-at-night-40131-large.mp4",
  },
  {
    id: "banner-2",
    title: "Cyberpunk 2077",
    smallTag: "PHANTOM LIBERTY",
    hoverImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop",
    video: "https://assets.mixkit.co/videos/preview/mixkit-neon-lights-in-a-futuristic-city-41551-large.mp4",
  },
  {
    id: "banner-3",
    title: "Apex Legends",
    smallTag: "SEASON 20 DEFIANCE",
    hoverImage: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600&auto=format&fit=crop",
    video: "https://assets.mixkit.co/videos/preview/mixkit-abstract-fast-lines-of-light-31742-large.mp4",
  },
];

const initialAboutData: AboutUsData = {
  title: "We Are Hexar Family",
  image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
  description:
    "Hexar Studio is a next-generation creative media and game development powerhouse. We craft immersive digital experiences, high-octane gaming content, and visionary brand narratives. Driven by innovation, passion, and creative excellence, our team turns ambitious ideas into world-class digital realities.",
};

const initialMissionVisionData: MissionVisionData = {
  backgroundVideo: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-digital-space-tunnel-41549-large.mp4",
  missionTitle: "Our Mission",
  missionDescription:
    "To push the boundaries of digital entertainment and interactive media by building ground-breaking products, empowering creators, and inspiring communities worldwide.",
  visionTitle: "Our Vision",
  visionDescription:
    "To become a global benchmark in creative media and gaming technology, delivering extraordinary experiences that connect millions through shared passion.",
};

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>("banner");
  const [loginError, setLoginError] = useState<string | null>(null);

  const [banners, setBanners] = useState<BannerItem[]>(initialBanners);
  const [ribbonText, setRibbonText] = useState<string>(
    "CREATE • INSPIRE • INNOVATE • CREATE • INSPIRE • INNOVATE"
  );
  const [aboutData, setAboutData] = useState<AboutUsData>(initialAboutData);
  const [missionVisionData, setMissionVisionData] = useState<MissionVisionData>(
    initialMissionVisionData
  );

  // Restore login state from localStorage on mount
  React.useEffect(() => {
    const storedLogin = localStorage.getItem("Login");
    if (storedLogin === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (u: string, p: string): boolean => {
    if (u === "admin" && p === "admin123") {
      setIsAuthenticated(true);
      setLoginError(null);
      localStorage.setItem("Login", "true");
      setActiveTab("banner");
      return true;
    } else {
      setLoginError("Invalid username or password");
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("Login");
    localStorage.setItem("Login", "false");
    setActiveTab("banner");
    setLoginError(null);
  };

  const addBanner = (newB: Omit<BannerItem, "id">) => {
    const item: BannerItem = {
      ...newB,
      id: `banner-${Date.now()}`,
    };
    setBanners((prev) => [item, ...prev]);
  };

  const updateBanner = (id: string, updated: Omit<BannerItem, "id">) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...updated, id } : b)));
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  const updateRibbonText = (text: string) => {
    setRibbonText(text);
  };

  const updateAboutData = (data: AboutUsData) => {
    setAboutData(data);
  };

  const updateMissionVisionData = (data: MissionVisionData) => {
    setMissionVisionData(data);
  };

  return (
    <CMSContext.Provider
      value={{
        isAuthenticated,
        activeTab,
        loginError,
        banners,
        ribbonText,
        aboutData,
        missionVisionData,
        login,
        logout,
        setActiveTab,
        addBanner,
        updateBanner,
        deleteBanner,
        updateRibbonText,
        updateAboutData,
        updateMissionVisionData,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error("useCMS must be used within a CMSProvider");
  }
  return context;
};
