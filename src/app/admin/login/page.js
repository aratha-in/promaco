"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../../styles/Admin.module.css";
import homeStyles from "../../../styles/Home.module.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h2>PROMACON</h2>
          <p>CRM Administrative Login</p>
        </div>

        {error && (
          <div className={homeStyles.formError} style={{ padding: "0.85rem", fontSize: "0.85rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div className={homeStyles.formGroup}>
            <label className={homeStyles.label} style={{ color: "#aaa" }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`${homeStyles.input} ${styles.loginInput}`}
              placeholder="Enter username"
              required
            />
          </div>

          <div className={homeStyles.formGroup}>
            <label className={homeStyles.label} style={{ color: "#aaa" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${homeStyles.input} ${styles.loginInput}`}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className={`${homeStyles.btnPrimary} ${homeStyles.submitBtn}`}
            style={{ marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.85rem" }}>
          <Link href="/" style={{ color: "var(--gold)" }}>
            &larr; Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
}
