"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiClient, setToken } from "@/lib/api-client";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("adminzivira");
  const [password, setPassword] = useState("ziviramumbai");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await apiClient.login(username, password);
      setToken(response.data.token);
      router.push("/admin/home");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="username">Username</label>
        <select id="username" value={username} onChange={(event) => setUsername(event.target.value)}>
          <option value="adminzivira">Zivira Labs Admin (adminzivira)</option>
          <option value="Zivira-SuperAdmin">Zivira-SuperAdmin</option>
          <option value="Zivira-Manager">Zivira-Manager</option>
          <option value="Zivira-fieldRepo">Zivira-fieldRepo</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      <button className="button" disabled={submitting} type="submit">
        {submitting ? "Signing in" : "Enter portal"}
        <ArrowRight size={17} />
      </button>
    </form>
  );
}
