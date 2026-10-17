import React, { useState } from "react";
import { loginApi, registerApi } from "../services/api.js";
import { useAuthStore } from "../stores/authStore.js";

export function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isRegister) {
        const data = await registerApi({ username, email, password, displayName });
        setAuth(data.user, data.accessToken);
      } else {
        const data = await loginApi({ email, password });
        setAuth(data.user, data.accessToken);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during authentication");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-[420px] rounded-[24px] bg-white p-8 shadow-soft transition-all duration-200">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center text-3xl font-bold tracking-tight text-ink">
            whisper
            <span className="ml-0.5 inline-block h-2 w-2 rounded-full bg-brand-peach" />
          </div>
          <p className="mt-2 text-sm text-ink-muted">
            {isRegister
              ? "Create your account to start chatting"
              : "Welcome back! Sign in to continue"}
          </p>
        </div>

        <div className="mb-6 flex rounded-full bg-mist p-1">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError(null);
            }}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition-all ${
              !isRegister
                ? "bg-white text-ink shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError(null);
            }}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition-all ${
              isRegister
                ? "bg-white text-ink shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Ali Khan"
                  className="mt-1 w-full rounded-2xl bg-mist px-4 py-3 text-sm text-ink outline-none transition focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="e.g. ali_khan"
                  className="mt-1 w-full rounded-2xl bg-mist px-4 py-3 text-sm text-ink outline-none transition focus:ring-2 focus:ring-brand"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-2xl bg-mist px-4 py-3 text-sm text-ink outline-none transition focus:ring-2 focus:ring-brand"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              className="mt-1 w-full rounded-2xl bg-mist px-4 py-3 text-sm text-ink outline-none transition focus:ring-2 focus:ring-brand"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-gradient-to-r from-brand-start to-brand-end py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting
              ? "Please wait..."
              : isRegister
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
