import * as SecureStore from "expo-secure-store";

// Per-service token persistence. SecureStore keeps values in the device keychain /
// keystore. Keys can't be enumerated, so we rehydrate by probing each known service.

const key = (serviceId) => `df_token_${serviceId}`;

export async function saveToken(serviceId, token) {
  try {
    await SecureStore.setItemAsync(key(serviceId), JSON.stringify(token));
  } catch (e) {
    // Non-fatal: an unstored token just means the user re-auths next launch.
    console.warn("saveToken failed", serviceId, e?.message);
  }
}

export async function loadToken(serviceId) {
  try {
    const raw = await SecureStore.getItemAsync(key(serviceId));
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export async function deleteToken(serviceId) {
  try {
    await SecureStore.deleteItemAsync(key(serviceId));
  } catch (e) {
    /* ignore */
  }
}

// Normalize an expo-auth-session token response into what we persist.
export function shapeToken(res, { simulated = false } = {}) {
  return {
    accessToken: res?.accessToken ?? null,
    refreshToken: res?.refreshToken ?? null,
    expiresAt: res?.expiresIn ? Date.now() + res.expiresIn * 1000 : null,
    scope: res?.scope ?? null,
    simulated,
    connectedAt: Date.now(),
  };
}
