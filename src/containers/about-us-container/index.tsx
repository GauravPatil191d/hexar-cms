"use client";

import React, { useState, useEffect } from "react";
import { useAbout } from "@/context/AboutContext";
import UploadService from "@/service/uploadService";
import { InputField } from "@/components/inputfield";
import { FileText, Save, CheckCircle2, AlertCircle } from "lucide-react";
import "./style.css";

export const AboutUsContainer: React.FC = () => {
  const { about, isLoading, error: apiError, getAbout, createAbout, updateAbout } = useAbout();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getAbout();
  }, []);

  useEffect(() => {
    if (about) {
      setTitle(about.about_title || "");
      setImage(about.about_image || "");
      setDescription(about.about_description || "");
    }
  }, [about]);

  const handleFileSelect = (url: string, file: File) => {
    setImage(url);
    if (file) {
      setImageFile(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let finalImageUrl = image;

      // Convert image File to string URL using UploadService
      if (imageFile) {
        finalImageUrl = await UploadService.UploadMedia(imageFile);
      }

      let success = false;
      if (about && about.about_generated_id) {
        success = await updateAbout(about.about_generated_id, title, finalImageUrl, description);
      } else {
        success = await createAbout(title, finalImageUrl, description);
      }

      if (success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err: any) {
      console.error("About save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="hexar-about-page animate-fade-in">
      <div className="hexar-card-panel">
        <div className="hexar-panel-header">
          <div className="hexar-panel-icon bg-blue-500/10 text-blue-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="hexar-panel-title">About Us CMS</h2>
            <p className="hexar-panel-subtitle">
              Manage the primary About section title, hero media, and brand storytelling narrative.
            </p>
          </div>
        </div>

        {showSuccess && (
          <div className="hexar-success-alert">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>About Us section updated successfully!</span>
          </div>
        )}

        {apiError && (
          <div className="hexar-error-alert flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="hexar-panel-form">
          <InputField
            label="About Section Title"
            placeholder="e.g. We Are Hexar Family"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <InputField
            label="About Section Image"
            type="file"
            accept="image/*"
            previewUrl={image}
            onFileSelect={handleFileSelect}
          />

          <InputField
            label="About Description"
            type="textarea"
            rows={6}
            placeholder="Enter the full paragraph description for About Us..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="hexar-panel-actions">
            <button type="submit" className="hexar-save-btn" disabled={isSaving || isLoading}>
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Uploading & Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
