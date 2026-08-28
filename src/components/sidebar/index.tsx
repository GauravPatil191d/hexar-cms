"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layers,
  Type,
  FileText,
  Compass,
  LogOut,
} from "lucide-react";
import { useCMS } from "@/context/CMSContext";
import "./style.css";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { logout } = useCMS();

  const menuItems = [
    {
      href: "/banner",
      label: "Banner",
      icon: <Layers className="w-5 h-5" />,
    },
    {
      href: "/ribbon",
      label: "Ribbon",
      icon: <Type className="w-5 h-5" />,
    },
    {
      href: "/about-us",
      label: "About Us",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      href: "/mission-vision",
      label: "Mission & Vision",
      icon: <Compass className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="hexar-sidebar">
      <div className="hexar-sidebar-brand">
        <img
          src="/images/hexar-logo.png"
          alt="Hexar Logo"
          className="hexar-logo-image"
        />
      </div>

      <div className="hexar-sidebar-menu">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`hexar-sidebar-item ${isActive ? "active" : ""}`}
            >
              <div className="hexar-item-content">
                <span className="hexar-menu-icon">{item.icon}</span>
                <span className="hexar-menu-label">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="hexar-sidebar-footer">
        <button onClick={logout} className="hexar-logout-button" title="Logout">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};