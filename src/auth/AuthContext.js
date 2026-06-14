import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

import { SERVICES } from "../data";
import { AUTH_CONFIG, isSimulated } from "./config";
import { saveToken, loadToken, deleteToken, shapeToken } from "./storage";

// Lets the auth popup hand control back to the app after redirect.
WebBrowser.maybeCompleteAuthSession();

const LIVE_IDS = SERVICES.filter((s) => s.live).map((s) => s.id);
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [linked, setLinked] = useState({});   // { spotify: tokenObj, ... }
  const [hydrated, setHydrated] = useState(false);

  // Consent-sheet state (drives <AuthSheet/>)
  const [authFor, setAuthFor] = useState(null);     // service obj being authorized
  const [authStep, setAuthStep] = useState("ask");  // ask | working | done
  const [authError, setAuthError] = useState(null);

  const redirectUri = AuthSession.makeRedirectUri({ scheme: "driveflow" });
  const spotifyCfg = AUTH_CONFIG.spotify;

  // One real OAuth request, for Spotify. Hooks must run unconditionally, so we pass
  // a placeholder client id when none is configured (we never prompt in that case).
  const [spotifyRequest, , spotifyPrompt] = AuthSession.useAuthRequest(
    {
      clientId: spotifyCfg.clientId || "driveflow-unconfigured",
      scopes: spotifyCfg.scopes,
      usePKCE: true,
      redirectUri,
    },
    spotifyCfg.discovery
  );

  // Rehydrate previously linked services from secure storage.
  useEffect(() => {
    (async () => {
      const entries = await Promise.all(
        LIVE_IDS.map(async (id) => [id, await loadToken(id)])
      );
      const next = {};
      for (const [id, tok] of entries) if (tok) next[id] = tok;
      setLinked(next);
      setHydrated(true);
    })();
  }, []);

  const linkedCount = Object.keys(linked).length;
  const isLinked = (id) => !!linked[id];

  const connectService = async (id, token) => {
    await saveToken(id, token);
    setLinked((l) => ({ ...l, [id]: token }));
  };

  const disconnect = async (id) => {
    await deleteToken(id);
    setLinked((l) => {
      const next = { ...l };
      delete next[id];
      return next;
    });
  };

  // ---- consent sheet controls ----
  const openAuth = (svc) => { setAuthError(null); setAuthFor(svc); setAuthStep("ask"); };
  const cancelAuth = () => { setAuthFor(null); setAuthError(null); setAuthStep("ask"); };

  const finishDone = async (id, token) => {
    await connectService(id, token);
    setAuthStep("done");
    await delay(900);
    setAuthFor((cur) => (cur && cur.id === id ? null : cur));
  };

  const authorize = async () => {
    const svc = authFor;
    if (!svc) return;
    setAuthError(null);
    setAuthStep("working");

    // Simulated providers (Apple Music, Audible, or Spotify without a client id).
    if (isSimulated(svc.id)) {
      await delay(1100);
      await finishDone(svc.id, shapeToken(null, { simulated: true }));
      return;
    }

    // Real Spotify Authorization Code + PKCE.
    try {
      if (!spotifyRequest) throw new Error("auth request not ready");
      const result = await spotifyPrompt();

      if (result.type !== "success") {
        // User dismissed or cancelled — return to the consent step.
        setAuthStep("ask");
        if (result.type === "error") {
          setAuthError(result.error?.message || "Authorization failed.");
        }
        return;
      }

      const token = await AuthSession.exchangeCodeAsync(
        {
          clientId: spotifyCfg.clientId,
          code: result.params.code,
          redirectUri,
          extraParams: { code_verifier: spotifyRequest.codeVerifier },
        },
        spotifyCfg.discovery
      );

      await finishDone(svc.id, shapeToken(token));
    } catch (e) {
      setAuthError("Couldn't connect. Please try again.");
      setAuthStep("ask");
    }
  };

  const value = useMemo(
    () => ({
      linked, linkedCount, isLinked, hydrated,
      authFor, authStep, authError,
      openAuth, cancelAuth, authorize, disconnect,
      redirectUri,
    }),
    [linked, linkedCount, hydrated, authFor, authStep, authError, redirectUri, spotifyRequest]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
