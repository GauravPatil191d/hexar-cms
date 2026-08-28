"use client";

import React, { useState } from "react";
import { useLogin } from "@/context/LoginContext";
import { useRouter } from "next/navigation";
import { InputField } from "@/components/inputfield";
import { Lock, User, AlertCircle, ArrowRight } from "lucide-react";
import "./style.css";

export const LoginContainer: React.FC = () => {
  const { login, loginError, isLoading: isContextLoading } = useLogin();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!username.trim() || !password.trim()) {
      setLocalError("Please enter both username and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await login(username.trim(), password.trim());
      if (success) {
        localStorage.setItem("Login", "true");
        router.push("/banner");
      }
    } catch (err: any) {
      setLocalError("Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || loginError;

  return (
    <div className="hexar-login-page">
      <div className="hexar-login-container animate-fade-in">
        <div className="hexar-login-header">
          <div className="hexar-login-brand">
            <div className="hexar-login-logo">
              <img
                src="/images/hexar-logo.png"
                alt="Hexar Logo"
                className="hexar-logo-image"
              />
            </div>
            <div className="hexar-brand-names">
              <span className="hexar-brand-name">HEXAR</span>
              <span className="hexar-brand-sub">CONTENT MANAGEMENT SYSTEM</span>
            </div>
          </div>
          <h2 className="hexar-login-title">Welcome Back</h2>
          <p className="hexar-login-subtitle">Sign in to access your CMS admin workspace</p>
        </div>

        {displayError && (
          <div className="hexar-error-banner">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>{displayError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="hexar-login-form">
          <InputField
            id="username-input"
            label="Username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            icon={<User className="w-4 h-4" />}
            required
          />

          <InputField
            id="password-input"
            label="Password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />

          <button
            type="submit"
            className="hexar-login-btn"
            disabled={isSubmitting || isContextLoading}
          >
            <span>{isSubmitting ? "Authenticating..." : "Sign In to Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="hexar-login-footer">
          <span>Protected Hexar CMS v1.0</span>
        </div>
      </div>
    </div>
  );
};