"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCard(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="login-page centered-layout">
      <div className={`login-glass-card ${showCard ? "visible" : ""}`}>
        <div className="login-card-header">
          <div className="brand-logo-container">
            <span className="brand-mark">Z</span>
            <span className="brand-name">Zivira Labs</span>
          </div>
          <h2>Admin Sign In</h2>
          <p className="muted">Seed user: adminzivira</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
