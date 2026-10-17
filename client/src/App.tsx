import { useEffect } from "react";
import { useAuthStore } from "./stores/authStore.js";
import { refreshApi, fetchMeApi } from "./services/api.js";
import { AuthForm } from "./components/AuthForm.js";
import { AppShell } from "./components/AppShell.js";

export function App() {
  const { user, isLoading, setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    async function initSession() {
      try {
        const { accessToken } = await refreshApi();
        const me = await fetchMeApi(accessToken);
        setAuth(me, accessToken);
      } catch {
        clearAuth();
      }
    }
    initSession();
  }, [setAuth, clearAuth]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <span className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
            whisper.
          </span>
        </div>
      </div>
    );
  }

  return user ? <AppShell /> : <AuthForm />;
}
