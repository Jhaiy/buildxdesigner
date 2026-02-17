import { useEffect } from 'react';
import { supabase, SupabaseSession, SupabaseAuthChangeEvent } from '../supabase/config/supabaseClient'; 

export const useAuthRedirect = (onSignedIn: () => void) => {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: SupabaseAuthChangeEvent, session: SupabaseSession | null) => {
        
        if (event === 'SIGNED_IN' && session) {

            setTimeout(() => {
                onSignedIn(); 
            }, 100); 
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [onSignedIn]);
};
