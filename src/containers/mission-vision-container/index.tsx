"use client";

import React, { useState, useEffect } from "react";
import { useMissionVision } from "@/context/MissionVisionContext";
import UploadService from "@/service/uploadService";
import { InputField } from "@/components/inputfield";
import { Compass, Save, CheckCircle2, Film, AlertCircle, Bookmark } from "lucide-react";
import "./style.css";

export const MissionVisionContainer: React.FC = () => {
  const { missionVision, loading, getMissionVision, createMissionVision, updateMissionVision } = useMissionVision();

  const [bgVideo, setBgVideo] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [mTitle, setMTitle] = useState("Our Mission");
  const [mDesc, setMDesc] = useState("");
  const [vTitle, setVTitle] = useState("Our Vision");
  const [vDesc, setVDesc] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getMissionVision();
  }, []);

  useEffect(() => {
    if (missionVision) {
      setBgVideo(missionVision.background_video || "");
      setMTitle(missionVision.mission_title || "Our Mission");
      setMDesc(missionVision.mission_description || "");
      setVTitle(missionVision.vision_title || "Our Vision");
      setVDesc(missionVision.vision_description || "");
    }
  }, [missionVision]);

  const handleVideoSelect = (url: string, file: File) => {
    if (file) {
      const maxSizeBytes = 80 * 1024 * 1024; // 80 MB
      if (file.size > maxSizeBytes) {
        setVideoError(
          `Background video file size must not exceed 80 MB. (Selected: ${(file.size / (1024 * 1024)).toFixed(1)} MB)`
        );
        return;
      }
      setVideoFile(file);
    }
    setVideoError(null);
    setBgVideo(url);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (videoError) return;

    setIsSaving(true);
    try {
      let finalVideoUrl = bgVideo;

      // Convert video file to string URL via UploadService
      if (videoFile) {
        finalVideoUrl = await UploadService.UploadMedia(videoFile);
      }

      const payload = {
        background_video: finalVideoUrl,
        mission_title: mTitle,
        mission_description: mDesc,
        vision_title: vTitle,
        vision_description: vDesc,
      };

      let success = false;
      if (missionVision && missionVision.mission_vision_generated_id) {
        success = await updateMissionVision(missionVision.mission_vision_generated_id, payload);
      } else {
        success = await createMissionVision(payload);
      }

      if (success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err: any) {
      console.error("MissionVision save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="hexar-mission-page animate-fade-in">
      <div className="hexar-card-panel">
        <div className="hexar-panel-header">
          <div className="hexar-panel-icon bg-emerald-500/10 text-emerald-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="hexar-panel-title">Mission & Vision CMS</h2>
            <p className="hexar-panel-subtitle">
              Configure background video loop and edit core company Mission & Vision statements.
            </p>
          </div>
        </div>

        {showSuccess && (
          <div className="hexar-success-alert">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Mission & Vision content saved successfully!</span>
          </div>
        )}

        {videoError && (
          <div className="hexar-error-alert flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{videoError}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="hexar-panel-form">
          {/* Background Video Section */}
          <div className="hexar-form-section">
            <div className="hexar-section-label">
              <Film className="w-4 h-4 text-indigo-400" />
              <span>Section Background Video (Max 80MB)</span>
            </div>
            <InputField
              label="Background Video File"
              type="file"
              accept="video/*"
              previewUrl={bgVideo}
              onFileSelect={handleVideoSelect}
            />
          </div>

          <div className="hexar-divider"></div>

          {/* Mission Section */}
          <div className="hexar-form-section">
            <div className="hexar-section-label">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Mission Section</span>
            </div>
            <InputField
              label="Mission Title"
              placeholder="e.g. Our Mission"
              value={mTitle}
              onChange={(e) => setMTitle(e.target.value)}
              required
            />
            <InputField
              label="Mission Description"
              type="textarea"
              rows={4}
              placeholder="Enter details of your mission..."
              value={mDesc}
              onChange={(e) => setMDesc(e.target.value)}
              required
            />
          </div>

          <div className="hexar-divider"></div>

          {/* Vision Section */}
          <div className="hexar-form-section">
            <div className="hexar-section-label">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>Vision Section</span>
            </div>
            <InputField
              label="Vision Title"
              placeholder="e.g. Our Vision"
              value={vTitle}
              onChange={(e) => setVTitle(e.target.value)}
              required
            />
            <InputField
              label="Vision Description"
              type="textarea"
              rows={4}
              placeholder="Enter details of your vision..."
              value={vDesc}
              onChange={(e) => setVDesc(e.target.value)}
              required
            />
          </div>

          <div className="hexar-panel-actions">
            <button type="submit" className="hexar-save-btn" disabled={isSaving || loading}>
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Uploading & Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
