"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";

import {
  useBanner,
  BannerData,
} from "@/context/BannerContext";

import UploadService from "@/service/uploadService";

import {
  Table,
  Column,
} from "@/components/table";

import {
  InputField,
} from "@/components/inputfield";

import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Image as ImageIcon,
  Video,
  UploadCloud,
  AlertCircle,
} from "lucide-react";

import "./style.css";

export const BannerContainer: React.FC = () => {
  const {
    banners,
    isLoading,
    error: apiError,
    getBanners,
    createBanner,
    updateBanner,
    deleteBanner,
  } = useBanner();

  /* =========================================================
     STATES
     ========================================================= */

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const [
    editingBannerId,
    setEditingBannerId,
  ] = useState<string | null>(null);

  const [
    mounted,
    setMounted,
  ] = useState(false);

  const [
    title,
    setTitle,
  ] = useState("");

  const [
    smallTag,
    setSmallTag,
  ] = useState("");

  const [
    bannerImage,
    setBannerImage,
  ] = useState("");

  const [
    bannerImageFile,
    setBannerImageFile,
  ] = useState<File | null>(null);

  const [
    video,
    setVideo,
  ] = useState("");

  const [
    videoFile,
    setVideoFile,
  ] = useState<File | null>(null);

  const [
    formError,
    setFormError,
  ] = useState("");

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  /* =========================================================
     INITIAL LOAD
     ========================================================= */

  useEffect(() => {
    setMounted(true);

    getBanners();
  }, []);

  /* =========================================================
     ADD MODAL
     ========================================================= */

  const handleOpenAddModal = () => {
    setEditingBannerId(null);

    setTitle("");
    setSmallTag("");

    setBannerImage("");
    setBannerImageFile(null);

    setVideo("");
    setVideoFile(null);

    setFormError("");

    setIsModalOpen(true);
  };

  /* =========================================================
     EDIT MODAL
     ========================================================= */

  const handleOpenEditModal = (
    banner: BannerData,
  ) => {
    const id =
      banner.banner_generated_id ||
      banner._id ||
      "";

    setEditingBannerId(id);

    setTitle(
      banner.banner_title || "",
    );

    setSmallTag(
      banner.banner_small_tag || "",
    );

    setBannerImage(
      banner.banner_image || "",
    );

    setBannerImageFile(null);

    setVideo(
      banner.banner_video || "",
    );

    setVideoFile(null);

    setFormError("");

    setIsModalOpen(true);
  };

  /* =========================================================
     CLOSE MODAL
     ========================================================= */

  const handleCloseModal = () => {
    setIsModalOpen(false);

    setEditingBannerId(null);

    setFormError("");
  };

  /* =========================================================
     IMAGE CHANGE
     ========================================================= */

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const previewUrl =
      URL.createObjectURL(file);

    setBannerImageFile(file);

    setBannerImage(previewUrl);

    setFormError("");
  };

  /* =========================================================
     VIDEO CHANGE
     ========================================================= */

  const handleVideoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const maxSizeBytes =
      80 * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      setFormError(
        `Video file size must not exceed 80 MB. Selected: ${(
          file.size /
          (1024 * 1024)
        ).toFixed(1)} MB`,
      );

      return;
    }

    const videoUrl =
      URL.createObjectURL(file);

    const tempVideo =
      document.createElement("video");

    tempVideo.preload =
      "metadata";

    tempVideo.src =
      videoUrl;

    tempVideo.onloadedmetadata = () => {
      if (tempVideo.duration < 7) {
        setFormError(
          `Banner video must be at least 7 seconds. Selected: ${tempVideo.duration.toFixed(
            1,
          )} seconds`,
        );

        setVideo("");
        setVideoFile(null);

        URL.revokeObjectURL(
          videoUrl,
        );

        return;
      }

      setVideoFile(file);

      setVideo(videoUrl);

      setFormError("");
    };

    tempVideo.onerror = () => {
      setFormError(
        "Unable to read video file.",
      );

      URL.revokeObjectURL(
        videoUrl,
      );
    };
  };

  /* =========================================================
     SAVE BANNER
     ========================================================= */

  const handleSave = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    if (!title.trim()) {
      setFormError(
        "Banner title is required.",
      );

      return;
    }

    if (!smallTag.trim()) {
      setFormError(
        "Banner small tag is required.",
      );

      return;
    }

    if (!bannerImage) {
      setFormError(
        "Banner image is required.",
      );

      return;
    }

    if (!video) {
      setFormError(
        "Banner video is required.",
      );

      return;
    }

    setIsSaving(true);

    setFormError("");

    try {
      let finalImageUrl =
        bannerImage;

      let finalVideoUrl =
        video;

      /* Upload new image only */

      if (bannerImageFile) {
        finalImageUrl =
          await UploadService.UploadMedia(
            bannerImageFile,
          );
      }

      /* Upload new video only */

      if (videoFile) {
        finalVideoUrl =
          await UploadService.UploadMedia(
            videoFile,
          );
      }

      const payload = {
        banner_title:
          title.trim(),

        banner_small_tag:
          smallTag.trim(),

        banner_image:
          finalImageUrl,

        banner_video:
          finalVideoUrl,
      };

      let success = false;

      if (editingBannerId) {
        success =
          await updateBanner(
            editingBannerId,
            payload,
          );
      } else {
        success =
          await createBanner(
            payload,
          );
      }

      if (success) {
        handleCloseModal();

        await getBanners();
      }
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Failed to save banner.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================================================
     DELETE BANNER
     ========================================================= */

  const handleDelete = async (
    id: string,
    bannerTitle: string,
  ) => {
    const confirmed =
      confirm(
        `Are you sure you want to delete "${bannerTitle}"?`,
      );

    if (!confirmed) return;

    await deleteBanner(id);
  };

  /* =========================================================
     TABLE COLUMNS
     ========================================================= */

  const columns: Column<BannerData>[] = [
    {
      key: "banner_image",

      header: "Image",

      width: "120px",

      render: (item) => (
        <div className="hexar-banner-thumb-box">
          {item.banner_image ? (
            <img
              src={item.banner_image}
              alt={item.banner_title}
              className="hexar-banner-thumb-img"
            />
          ) : (
            <div className="hexar-banner-no-img">
              <ImageIcon
                className="w-5 h-5"
              />
            </div>
          )}
        </div>
      ),
    },

    {
      key: "banner_title",

      header: "Banner Title",

      render: (item) => (
        <div className="hexar-banner-title-content">
          <span className="hexar-banner-title">
            {item.banner_title}
          </span>

          <span className="hexar-banner-id">
            ID:{" "}
            {item.banner_generated_id ||
              item._id ||
              "N/A"}
          </span>
        </div>
      ),
    },

    {
      key: "banner_small_tag",

      header: "Small Tag",

      render: (item) => (
        <span className="hexar-tag-badge">
          {item.banner_small_tag ||
            "N/A"}
        </span>
      ),
    },

    {
      key: "banner_video",

      header: "Video",

      render: (item) => (
        <div className="hexar-video-status">
          <Video />

          <span>
            {item.banner_video
              ? "Video attached"
              : "No video"}
          </span>
        </div>
      ),
    },

    {
      key: "actions",

      header: "Actions",

      align: "right",

      width: "140px",

      render: (item) => {
        const id =
          item.banner_generated_id ||
          item._id ||
          "";

        return (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() =>
                handleOpenEditModal(
                  item,
                )
              }
              className="hexar-action-btn edit"
              title="Edit Banner"
              aria-label="Edit Banner"
            >
              <Edit2 />
            </button>

            <button
              type="button"
              onClick={() =>
                handleDelete(
                  id,
                  item.banner_title,
                )
              }
              className="hexar-action-btn delete"
              title="Delete Banner"
              aria-label="Delete Banner"
            >
              <Trash2 />
            </button>
          </div>
        );
      },
    },
  ];

  /* =========================================================
     MODAL
     ========================================================= */

  const renderModal = () => {
    if (
      !isModalOpen ||
      !mounted
    ) {
      return null;
    }

    return createPortal(
      <div
        className="hexar-modal-backdrop"
        onClick={handleCloseModal}
      >
        <div
          className="hexar-modal-card"
          onClick={(e) =>
            e.stopPropagation()
          }
        >
          {/* ===============================
              MODAL HEADER
             =============================== */}

          <div className="hexar-modal-header">
            <div>
              <h2 className="hexar-modal-title">
                {editingBannerId
                  ? "Edit Banner"
                  : "Add New Banner"}
              </h2>

              <p className="hexar-modal-subtitle">
                Configure the banner details,
                image and video for the homepage.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCloseModal}
              className="hexar-modal-close"
              aria-label="Close modal"
            >
              <X />
            </button>
          </div>

          {/* ===============================
              FORM ERROR
             =============================== */}

          {formError && (
            <div className="hexar-form-error-box">
              <AlertCircle />

              <span>
                {formError}
              </span>
            </div>
          )}

          {/* ===============================
              FORM
             =============================== */}

          <form
            onSubmit={handleSave}
            className="hexar-modal-form"
          >
            {/* ===============================
                TEXT INPUTS
               =============================== */}

            <div className="hexar-form-grid">
              <InputField
                label="Banner Title"
                placeholder="e.g. Call of Duty Black Ops"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value,
                  )
                }
                required
              />

              <InputField
                label="Small Tag"
                placeholder="e.g. ENTER THE WAR"
                value={smallTag}
                onChange={(e) =>
                  setSmallTag(
                    e.target.value,
                  )
                }
                required
              />
            </div>

            {/* ===============================
                MEDIA UPLOADS
               =============================== */}

            <div className="hexar-file-upload-group">
              {/* IMAGE */}

              <div className="hexar-file-upload">
                <label className="hexar-file-upload-label">
                  {bannerImage ? (
                    <div className="hexar-file-preview">
                      <img
                        src={bannerImage}
                        alt="Banner preview"
                        className="hexar-file-preview-img"
                      />

                      <div className="hexar-file-overlay">
                        <span>
                          Change Image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="hexar-file-upload-placeholder">
                      <UploadCloud />

                      <span>
                        Upload Image
                      </span>

                      <small>
                        PNG, JPG, WEBP
                      </small>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hexar-file-input-hidden"
                  />
                </label>

                {bannerImage && (
                  <button
                    type="button"
                    className="hexar-file-remove"
                    onClick={() => {
                      setBannerImage("");
                      setBannerImageFile(null);
                    }}
                  >
                    Remove Image
                  </button>
                )}
              </div>

              {/* VIDEO */}

              <div className="hexar-file-upload">
                <label className="hexar-file-upload-label">
                  {video ? (
                    <div className="hexar-file-preview">
                      <video
                        src={video}
                        className="hexar-file-preview-video"
                        muted
                        autoPlay
                        loop
                        playsInline
                      />

                      <div className="hexar-file-overlay">
                        <span>
                          Change Video
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="hexar-file-upload-placeholder">
                      <UploadCloud />

                      <span>
                        Upload Video
                      </span>

                      <small>
                        MP4, WEBM
                        <br />
                        Minimum 7 seconds
                        <br />
                        Maximum 80 MB
                      </small>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={handleVideoChange}
                    className="hexar-file-input-hidden"
                  />
                </label>

                {video && (
                  <button
                    type="button"
                    className="hexar-file-remove"
                    onClick={() => {
                      setVideo("");
                      setVideoFile(null);
                    }}
                  >
                    Remove Video
                  </button>
                )}
              </div>
            </div>

            {/* ===============================
                MODAL FOOTER
               =============================== */}

            <div className="hexar-modal-footer">
              <button
                type="button"
                onClick={handleCloseModal}
                className="hexar-btn-secondary"
                disabled={isSaving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="hexar-btn-primary"
                disabled={isSaving}
              >
                <Check />

                <span>
                  {isSaving
                    ? "Uploading & Saving..."
                    : editingBannerId
                      ? "Update Banner"
                      : "Save Banner"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>,

      document.body,
    );
  };

  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <div className="hexar-banner-page animate-fade-in">
      {/* ===============================
          API ERROR
         =============================== */}

      {apiError && (
        <div className="hexar-error-alert">
          <AlertCircle />

          <span>
            {apiError}
          </span>
        </div>
      )}

      {/* ===============================
          BANNER TABLE
         =============================== */}

      <div className="hexar-banner-card-panel">
        {/* Custom Panel Header */}
        <div className="hexar-banner-panel-header">
          <div className="hexar-banner-panel-icon">
            <ImageIcon className="w-6 h-6" />
          </div>

          <div className="hexar-banner-panel-header-text">
            <h2 className="hexar-banner-panel-title">
              Homepage Banners
            </h2>
            <p className="hexar-banner-panel-subtitle">
              Manage banner images, videos, and tags for the homepage hero section.
            </p>
          </div>

          <div className="hexar-banner-panel-action">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="hexar-add-banner-btn"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4" />
              <span>Add Banner</span>
            </button>
          </div>
        </div>

        {/* Table without header (title/subtitle set to empty) */}
        <Table
          title=""
          subtitle=""
          columns={columns}
          data={banners}
          keyExtractor={(item) =>
            item.banner_generated_id ||
            item._id ||
            item.banner_title
          }
          emptyText="No banners found"
          emptySubtext="Click Add Banner to create your first banner."
        />
      </div>

      {/* ===============================
          MODAL
         =============================== */}

      {renderModal()}
    </div>
  );
};