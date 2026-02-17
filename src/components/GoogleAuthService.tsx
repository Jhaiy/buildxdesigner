import React from 'react'; 
import { supabase } from '../supabase/config/supabaseClient'; 
import { initiateGoogleSignIn, signOut as supabaseSignOut } from '../supabase/auth/authService'; 

export interface GoogleUser {
    id: string;
    name: string;
    email: string;
    picture: string;
    given_name?: string;
    family_name?: string;
}

export interface GoogleAuthConfig {
    clientId: string;
    redirectUri: string;
    scope: string;
}

export class GoogleAuthService {
    private static instance: GoogleAuthService;
    
    public static getInstance(): GoogleAuthService {
        if (!GoogleAuthService.instance) {
            GoogleAuthService.instance = new GoogleAuthService();
        }
        return GoogleAuthService.instance;
    }

    /**
     * UPDATED: Initiates the Supabase Google OAuth redirect flow.
     * @param redirectToPath - The path within your app to land on after Google completes.
     * @returns The redirect URL if successful, otherwise throws an error.
     */
    public async signIn(redirectToPath: string = '/dashboard'): Promise<{ url: string }> {
        console.log('🔐 Initiating Supabase Google OAuth redirect flow...');
        
        // This calls the function in src/supabase/authentication.ts
        const result = await initiateGoogleSignIn(redirectToPath);
        
        if (result.success && result.url) {
            // Return the URL so the hook can trigger the browser redirect
            return { url: result.url };
        } else {
            console.error('❌ Supabase redirect initiation failed:', result.error);
            throw new Error(result.error?.message || 'Failed to start Supabase Google sign-in.');
        }
    }

    // --- CLEANED UP MOCK PERSISTENCE METHODS ---
    // NOTE: These are simplified as session management is now handled by the Supabase SDK.

    public async handleCallback(authorizationCode: string): Promise<GoogleUser> {
        throw new Error('Method not used for Supabase Client Auth. Use session listeners.');
    }

    /**
     * Calls the real Supabase sign-out function.
     */
    public async signOut(): Promise<void> {
        await supabaseSignOut(); // Calls the exported function from authentication.ts
        console.log('🚪 User signed out from Supabase.');
    }

    // These persistence methods are removed/simplified as the Dashboard uses 
    // getSupabaseSession() for real-time status.
    public getCurrentUser(): GoogleUser | null { return null; }
    public isAuthenticated(): boolean { return false; } 
}

// Export singleton instance
export const googleAuth = GoogleAuthService.getInstance();

// React hook for Google authentication
export const useGoogleAuth = () => {
    // The user object here is usually for display/context, not session persistence management.
    const [user, setUser] = React.useState<GoogleUser | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Subscribe to auth state changes to keep the hook's user state updated.
    React.useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                // If signed in, update local user state for components using this hook
                if (session?.user) {
                    const metadata = session.user.user_metadata;
                    // Mock/map the Supabase user data to your local GoogleUser interface
                    setUser({
                        id: session.user.id,
                        email: session.user.email || '',
                        name: metadata?.full_name || metadata?.name || session.user.email || 'User',
                        picture: metadata?.avatar_url || '',
                    } as GoogleUser);
                } else if (event === 'SIGNED_OUT') {
                    setUser(null);
                }
                setLoading(false); // Auth status is confirmed
            }
        );
        
        // Check initial session immediately
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                const metadata = session.user.user_metadata;
                setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: metadata?.full_name || metadata?.name || session.user.email || 'User',
                    picture: metadata?.avatar_url || '',
                } as GoogleUser);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    /**
     * UPDATED: Triggers the redirect, and stops local execution if successful.
     */
    const signIn = async (redirectToPath: string = '/dashboard') => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await googleAuth.signIn(redirectToPath);
            
            // 🚨 CRITICAL: Initiate the redirect immediately.
            if (result.url) {
                window.location.href = result.url;
                // Execution stops here!
            }
            
        } catch (err: any) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
            setLoading(false); // Only set back to false if the redirection failed
        } 
    };

    const signOut = async () => {
        await supabaseSignOut(); // Call the real sign out from Supabase utility
        setUser(null);
        setError(null);
    };

    return {
        user,
        loading,
        error,
        signIn,
        signOut,
        // isAuthenticated is derived from 'user' existence in this hook
        isAuthenticated: !!user 
    };
};
