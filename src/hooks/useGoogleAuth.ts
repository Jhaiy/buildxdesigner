import { useState } from 'react';
import { initiateGoogleSignIn } from '../supabase/auth/authService'; 

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (redirectPath: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await initiateGoogleSignIn(redirectPath);

      if (result.success && result.url) {
        window.location.href = result.url;
      } else if (result.error) {
        setError(result.error.message);
        setLoading(false);
      }
      
    } catch (err) {
      console.error('Google authentication failed:', err);
      setError('An unknown error occurred during Google sign-in.');
      setLoading(false);
    }
  };

  return { signIn, loading, error };
};
