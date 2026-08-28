"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Bell, ShieldCheck } from "lucide-react";
import "./style.css";

export const Header: React.FC = () => {
  const pathname = usePathname();

  const getTabTitle = () => {
    if (pathname.includes("/banner")) return "Homepage Banner Management";
    if (pathname.includes("/ribbon")) return "Moving Ribbon Marquee";
    if (pathname.includes("/about-us")) return "About Us Content";
    if (pathname.includes("/mission-vision")) return "Mission & Vision Section";
    return "CMS Management";
  };

  return (
    <header className="hexar-header">
      <div className="hexar-header-left">
        <h1 className="hexar-header-title">{getTabTitle()}</h1>
      </div>

      <div className="hexar-header-right">
        <div className="hexar-nav-badge">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-gray-300 font-medium">Logged in as admin</span>
        </div>

        <button className="hexar-nav-icon-btn" title="Notifications">
          <Bell className="w-4.5 h-4.5" />
          <span className="hexar-badge-ping"></span>
        </button>
      </div>
    </header>
  );
};
