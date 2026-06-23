const authStorageKey = "foodmood.supabaseAuth";

type SupabaseAuthTokens = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
};

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function isSupabaseAuthConfigured() {
  return Boolean(getSupabaseUrl());
}

export function getGoogleLoginUrl(origin: string) {
  const supabaseUrl = getSupabaseUrl();
  if (!supabaseUrl) return null;
  const redirectTo = `${origin}/auth/callback`;
  const url = new URL(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/authorize`);
  url.searchParams.set("provider", "google");
  url.searchParams.set("redirect_to", redirectTo);
  url.searchParams.set("response_type", "token");
  return url.toString();
}

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
