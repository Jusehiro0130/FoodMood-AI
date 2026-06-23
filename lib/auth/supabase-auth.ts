const authStorageKey = "foodmood.supabaseAuth";

type SupabaseAuthTokens = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
};

export function readTokensFromHash(hash: string): SupabaseAuthTokens | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const accessToken = params.get("access_token");
  if (!accessToken) return null;
  const expiresIn = Number(params.get("expires_in") ?? 0);
  return {
    accessToken,
    refreshToken: params.get("refresh_token") ?? undefined,
    expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : undefined,
  };
}

export function saveAuthTokens(tokens: SupabaseAuthTokens) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(authStorageKey, JSON.stringify(tokens));
}

export function clearAuthTokens() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(authStorageKey);
}
