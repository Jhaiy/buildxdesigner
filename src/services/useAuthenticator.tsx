import React, { useEffect, useState } from "react";
import { supabase, SupabaseSession } from "../supabase/config/supabaseClient";

// Dev notes:
// Ito yung component for checking the valid sessions if user is already logged in to the website. This can be reused for other pages such as the admin pages.
// Note that this can only be used for supabase authenticated sessions. If there are other session types, then ako na maglalagay ng auth mismo. <3

// Check App.tsx for usage example.

type LoginAuthSessionCheckerProps = {
  children?: React.ReactNode;
  onAuthenticated?: (session?: SupabaseSession) => void;
};

function LoginAuthSessionChecker({
  children,
  onAuthenticated,
}: LoginAuthSessionCheckerProps) {
  const [session, setSession] = useState<SupabaseSession | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        onAuthenticated?.(session);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          onAuthenticated?.(session);
        }
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [onAuthenticated]);

  return session ? null : <>{children}</>;
}

export default LoginAuthSessionChecker;
