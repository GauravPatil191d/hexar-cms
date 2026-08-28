"use client";

import React, { useState, useEffect } from "react";
import { useRibbon } from "@/context/RibbonContext";
import { InputField } from "@/components/inputfield";
import { Type, Save, CheckCircle2, Plus, X, AlertCircle } from "lucide-react";
import "./style.css";

export const RibbonContainer: React.FC = () => {
  const { ribbon, isLoading, error: apiError, getRibbon, createRibbon, updateRibbon } = useRibbon();

  const [items, setItems] = useState<string[]>(["CREATE", "INSPIRE", "INNOVATE"]);
  const [newWord, setNewWord] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getRibbon();
  }, []);

  useEffect(() => {
    if (ribbon && ribbon.ribbon_text) {
      const parsed = ribbon.ribbon_text
        .split("•")
        .map((s) => s.trim())
        .filter((s, idx, arr) => s.length > 0 && arr.indexOf(s) === idx);
      if (parsed.length > 0) {
        setItems(parsed);
      }
    }
  }, [ribbon]);

  const formattedString = items.map((w) => w.toUpperCase()).join(" • ");

  const handleAddWord = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newWord.trim()) {
      const formatted = newWord.trim().toUpperCase();
      if (!items.includes(formatted)) {
        setItems([...items, formatted]);
      }
      setNewWord("");
    }
  };

  const handleRemoveWord = (indexToRemove: number) => {
    setItems(items.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const finalString = Array(3).fill(formattedString).join(" • ");

    let success = false;
    if (ribbon && ribbon.ribbon_generated_id) {
      success = await updateRibbon(ribbon.ribbon_generated_id, finalString);
    } else {
      success = await createRibbon(finalString);
    }

    setIsSaving(false);
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="hexar-ribbon-page animate-fade-in">
      <div className="hexar-card-panel">
        <div className="hexar-panel-header">
          <div className="hexar-panel-icon bg-amber-500/10 text-amber-400">
            <Type className="w-6 h-6" />
          </div>
          <div>
            <h2 className="hexar-panel-title">Moving Text Ribbon</h2>
            <p className="hexar-panel-subtitle">
              Add individual action words (e.g. INSPIRE, CREATE, INNOVATE) to build the continuous moving marquee ribbon.
            </p>
          </div>
        </div>

        {showSuccess && (
          <div className="hexar-success-alert">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Ribbon marquee updated successfully!</span>
          </div>
        )}

        {apiError && (
          <div className="hexar-error-alert flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="hexar-panel-form">
          {/* Add Word Input */}
          <div className="hexar-tag-input-row">
            <InputField
              label="Add Ribbon Tag Word"
              placeholder="e.g. INSPIRE, CREATE, INNOVATE..."
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              className="flex-1"
            />
            <button
              type="button"
              onClick={handleAddWord}
              className="hexar-add-word-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Add Word</span>
            </button>
          </div>

          {/* Active Words Chip List */}
          <div className="hexar-words-container">
            <span className="hexar-words-label">Configured Words / Tags:</span>
            <div className="hexar-words-chips">
              {items.map((word, idx) => (
                <div key={idx} className="hexar-word-chip">
                  <span>{word}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveWord(idx)}
                    className="hexar-remove-chip"
                    title="Remove word"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Live Marquee Ticker Preview */}
          <div className="hexar-preview-marquee-wrapper">
            <span className="hexar-preview-tag">LIVE RIBBON PREVIEW:</span>
            <div className="hexar-marquee-track">
              <div className="hexar-marquee-content animate-marquee">
                <span>{formattedString || "ADD WORDS ABOVE"}</span>
                <span className="mx-6">•</span>
                <span>{formattedString || "ADD WORDS ABOVE"}</span>
                <span className="mx-6">•</span>
              </div>
            </div>
          </div>

          <div className="hexar-panel-actions">
            <button type="submit" className="hexar-save-btn" disabled={isSaving || isLoading}>
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
