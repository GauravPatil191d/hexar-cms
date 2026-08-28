"use client";

import React from "react";
import { useCMS } from "@/context/CMSContext";
import {
  Image as ImageIcon,
  Sparkles,
  Info,
  Target,
  ArrowRight,
  TrendingUp,
  Sliders,
  Layers,
} from "lucide-react";
import "./style.css";

export const DashboardContainer: React.FC = () => {
  const { banners, ribbonText, aboutData, missionVisionData, setActiveTab } = useCMS();

  const stats = [
    {
      title: "Active Banners",
      value: banners.length,
      sub: "Homepage hero slides",
      icon: <ImageIcon className="w-6 h-6 text-indigo-400" />,
      tab: "banner" as const,
      color: "indigo",
    },
    {
      title: "Moving Ribbon",
      value: "Active",
      sub: `${ribbonText.length} characters configured`,
      icon: <Sparkles className="w-6 h-6 text-amber-400" />,
      tab: "ribbon" as const,
      color: "amber",
    },
    {
      title: "About Us Section",
      value: aboutData.title ? "Configured" : "Empty",
      sub: aboutData.title || "No title",
      icon: <Info className="w-6 h-6 text-blue-400" />,
      tab: "about-us" as const,
      color: "blue",
    },
    {
      title: "Mission & Vision",
      value: "Configured",
      sub: `${missionVisionData.missionTitle} & ${missionVisionData.visionTitle}`,
      icon: <Target className="w-6 h-6 text-emerald-400" />,
      tab: "mission-vision" as const,
      color: "emerald",
    },
  ];

  return (
    <div className="hexar-dashboard-page animate-fade-in">
      {/* Hero Welcome Box */}
      <div className="hexar-hero-card">
        <div className="hexar-hero-content">
          <div className="hexar-hero-badge">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span>Hexar Homepage Control Center</span>
          </div>
          <h1 className="hexar-hero-title">Welcome to Hexar CMS</h1>
          <p className="hexar-hero-desc">
            Manage your homepage content from here. You can customize the high-octane banners, moving text ribbon marquee, about us storytelling, and mission/vision video content.
          </p>
        </div>
        <div className="hexar-hero-decoration">
          <div className="hexar-hero-icon-bg">
            <Layers className="w-32 h-32 text-indigo-500/10" />
          </div>
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div className="hexar-stats-grid">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="hexar-stat-card"
            onClick={() => setActiveTab(stat.tab)}
          >
            <div className="hexar-stat-header">
              <div className={`hexar-stat-icon-wrapper color-${stat.color}`}>
                {stat.icon}
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 hexar-stat-arrow" />
            </div>
            <div className="hexar-stat-body">
              <span className="hexar-stat-value">{stat.value}</span>
              <span className="hexar-stat-title">{stat.title}</span>
              <span className="hexar-stat-sub">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="hexar-quick-section">
        <div className="hexar-section-header">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h2 className="hexar-section-title">Quick Management Actions</h2>
          </div>
          <span className="hexar-section-sub">Direct links to edit homepage sections</span>
        </div>

        <div className="hexar-actions-grid">
          <button
            onClick={() => setActiveTab("banner")}
            className="hexar-action-tile"
          >
            <div className="hexar-tile-left">
              <div className="hexar-tile-icon bg-indigo-500/10 text-indigo-400">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="hexar-tile-info">
                <span className="hexar-tile-title">Manage Banners</span>
                <span className="hexar-tile-desc">Add, edit or reorder hero banner slides & videos</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => setActiveTab("ribbon")}
            className="hexar-action-tile"
          >
            <div className="hexar-tile-left">
              <div className="hexar-tile-icon bg-amber-500/10 text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="hexar-tile-info">
                <span className="hexar-tile-title">Edit Ribbon Marquee</span>
                <span className="hexar-tile-desc">Update moving text ribbon displayed below banner</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => setActiveTab("about-us")}
            className="hexar-action-tile"
          >
            <div className="hexar-tile-left">
              <div className="hexar-tile-icon bg-blue-500/10 text-blue-400">
                <Info className="w-5 h-5" />
              </div>
              <div className="hexar-tile-info">
                <span className="hexar-tile-title">Edit About Us</span>
                <span className="hexar-tile-desc">Update brand description, title, and featured photo</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => setActiveTab("mission-vision")}
            className="hexar-action-tile"
          >
            <div className="hexar-tile-left">
              <div className="hexar-tile-icon bg-emerald-500/10 text-emerald-400">
                <Target className="w-5 h-5" />
              </div>
              <div className="hexar-tile-info">
                <span className="hexar-tile-title">Edit Mission & Vision</span>
                <span className="hexar-tile-desc">Upload background video and refine core mission statements</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
