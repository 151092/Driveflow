import React from "react";
import { useAuth } from "./AuthContext";
import AuthSheet from "../components/AuthSheet";

// Single, app-level instance of the consent sheet. Driven entirely by AuthContext
// so any screen can trigger it via openAuth() without rendering its own copy.
export default function AuthSheetHost() {
  const { authFor, authStep, authError, authorize, cancelAuth } = useAuth();
  return (
    <AuthSheet
      service={authFor}
      step={authStep}
      error={authError}
      onAuthorize={authorize}
      onCancel={cancelAuth}
    />
  );
}
