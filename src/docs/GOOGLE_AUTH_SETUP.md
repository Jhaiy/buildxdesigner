# Google OAuth Setup Guide for CodeCraft

This guide explains how to implement Google OAuth authentication in your CodeCraft application.

## 🚀 Quick Start (Demo Mode)

The current implementation uses a simulated Google OAuth flow for demonstration purposes. It will show the Google login interface and simulate successful authentication.

## 🔧 Production Setup

To implement real Google OAuth, follow these steps:

### 1. Google Cloud Console Setup

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project or select existing one**
3. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
   - Also enable "Google Identity API"

4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Configure consent screen if prompted
   - Choose "Web application"
   - Add authorized origins: `http://localhost:3000`, `https://yourdomain.com`
   - Add redirect URIs: `http://localhost:3000/auth/google/callback`, `https://yourdomain.com/auth/google/callback`

### 2. Environment Variables

Create a `.env.local` file:

\`\`\`env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
\`\`\`

### 3. Update GoogleAuthService.tsx

Replace the mock configuration:

\`\`\`typescript
const GOOGLE_AUTH_CONFIG: GoogleAuthConfig = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
  scope: 'openid email profile'
};
\`\`\`

### 4. Backend Implementation

Create API endpoints for OAuth handling:

#### `/api/auth/google/login` (GET)
\`\`\`typescript
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const authUrl = `https://accounts.google.com/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI!)}&` +
    `scope=${encodeURIComponent('openid email profile')}&` +
    `response_type=code&` +
    `access_type=offline`;
  
  res.redirect(authUrl);
}
\`\`\`

#### `/api/auth/google/callback` (POST)
\`\`\`typescript
import { google } from 'googleapis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.body;
  
  try {
    // Exchange code for tokens
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    
    // Create/update user in your database
    const user = await createOrUpdateUser(userInfo.data);
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: 'Authentication failed' });
  }
}
\`\`\`

### 5. Frontend Integration

Update the `signIn` method in `GoogleAuthService.tsx`:

\`\`\`typescript
public async signIn(): Promise<GoogleUser> {
  // Redirect to backend OAuth endpoint
  window.location.href = '/api/auth/google/login';
  
  // The callback will be handled by your backend
  // and redirect back to your app with the user data
}
\`\`\`

### 6. Alternative: Using NextAuth.js

For a more complete solution, consider using NextAuth.js:

\`\`\`bash
npm install next-auth
\`\`\`

#### `pages/api/auth/[...nextauth].ts`
\`\`\`typescript
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub!
      return session
    },
  },
})
\`\`\`

#### Usage in React components:
\`\`\`typescript
import { signIn, signOut, useSession } from 'next-auth/react'

function AuthButton() {
  const { data: session } = useSession()
  
  if (session) {
    return (
      <div>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }
  
  return (
    <button onClick={() => signIn('google')}>
      Sign in with Google
    </button>
  )
}
\`\`\`

## 🔐 Security Considerations

1. **HTTPS Only**: Always use HTTPS in production
2. **Secure Cookies**: Set secure flags on authentication cookies
3. **Token Validation**: Always validate JWT tokens on the backend
4. **CSRF Protection**: Implement CSRF protection for state parameter
5. **Rate Limiting**: Add rate limiting to prevent abuse

## 🧪 Testing

1. **Development**: Test with localhost URLs
2. **Staging**: Use staging domain in Google Console
3. **Production**: Use production domain

## 📚 Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Identity API](https://developers.google.com/identity)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [React Google Login Library](https://www.npmjs.com/package/react-google-login)

## 🎯 Current Demo Features

The current implementation includes:

- ✅ Google-styled sign-in button
- ✅ Loading states and animations
- ✅ Error handling and display
- ✅ Simulated OAuth flow
- ✅ User data mock-up
- ✅ Integration with existing auth flow

## 🚧 Next Steps for Production

1. Set up Google Cloud Console project
2. Configure OAuth credentials  
3. Implement backend API endpoints
4. Add user database integration
5. Set up JWT token management
6. Add session persistence
7. Implement logout functionality
8. Add error boundary components
9. Set up monitoring and analytics
10. Add comprehensive testing

---

**Note**: The current implementation is for demonstration purposes only. For production use, follow the setup guide above and implement proper backend authentication handling.
