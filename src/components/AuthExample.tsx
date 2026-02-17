import React from 'react';
import { useGoogleAuth } from './GoogleAuthService';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LogOut, User } from 'lucide-react';

/**
 * Example component demonstrating Google Authentication usage
 * This shows how to integrate Google auth into your app components
 */
export const AuthExample: React.FC = () => {
  const { user, loading, error, signIn, signOut, isAuthenticated } = useGoogleAuth();

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3">Loading...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-destructive mb-4">Authentication Error:</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={signIn} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isAuthenticated && user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Welcome to FullDev AI!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.picture} alt={user.name} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <Button 
              onClick={signOut} 
              variant="outline" 
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Get Started</CardTitle>
        <p className="text-center text-muted-foreground">
          Sign in to access all features
        </p>
      </CardHeader>
      <CardContent>
        <Button onClick={signIn} className="w-full">
          Sign in with Google
        </Button>
      </CardContent>
    </Card>
  );
};

/**
 * HOC to protect routes that require authentication
 */
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  return (props: P) => {
    const { isAuthenticated, loading } = useGoogleAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <AuthExample />;
    }

    return <Component {...props} />;
  };
};

export default AuthExample;
