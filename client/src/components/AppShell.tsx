import { useAuthStore } from "../stores/authStore.js";
import { logoutApi } from "../services/api.js";

const AVATAR_GRADIENTS = [
  "from-[#E0C3FC] to-[#8EC5FC]", // lavender
  "from-[#FFD1FF] to-[#FAD0C4]", // peach
  "from-[#D4FC79] to-[#96E6A1]", // mint
  "from-[#FFA8A8] to-[#FCFF00]", // rose
];

function getAvatarGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

export function AppShell() {
  const { user, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } finally {
      clearAuth();
    }
  };

  if (!user) return null;

  const initials = user.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[24px] bg-white p-8 shadow-soft">
        <div className="flex items-center justify-between border-b border-gray-100 pb-6">
          <div className="inline-flex items-center text-2xl font-bold tracking-tight text-ink">
            whisper
            <span className="ml-0.5 inline-block h-2 w-2 rounded-full bg-brand-peach" />
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full bg-mist px-4 py-1.5 text-xs font-semibold text-ink-muted transition hover:bg-gray-200 hover:text-ink"
          >
            Sign Out
          </button>
        </div>

        <div className="my-8 flex flex-col items-center text-center">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr ${getAvatarGradient(
              user.id
            )} text-2xl font-bold text-white shadow-subtle`}
          >
            {initials}
          </div>

          <h2 className="mt-4 text-xl font-bold text-ink">{user.displayName}</h2>
          <p className="text-sm font-medium text-brand-deep">@{user.username}</p>
          <p className="mt-1 text-xs text-ink-muted">{user.email}</p>
          {user.about && (
            <p className="mt-3 rounded-xl bg-mist px-4 py-2 text-xs italic text-ink-muted">
              "{user.about}"
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-emerald-800">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Phase 1 Exit Gate Ready
            </h3>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-emerald-700">
            Authentication, refresh cookie rotation, and database session are all
            working. Refreshing this browser tab will keep you securely logged in.
          </p>
        </div>
      </div>
    </div>
  );
}
