# Admin Dashboard Guide

## Accessing the Admin Dashboard

1. **Admin Login Page**: Click the "Admin" link in the bottom-right corner of the landing page
2. **Login Credentials** (Demo):
   - Username: `admin`
   - Password: `admin123`

## Admin Dashboard Features

### Overview Tab
- View key statistics:
  - Total Users
  - Active Subscriptions
  - Monthly Revenue
  - Growth Rate
- Quick view of recent users and subscriptions

### Users Tab
Manage all registered users:
- **View Users**: See all user accounts with details
- **Filter**: By status (active/inactive/banned) and plan
- **Search**: Find users by name or email
- **Actions**:
  - Edit user details (name, email, plan, status)
  - Ban/Activate users
  - Send emails
  - Delete users
- **Export**: Export user data

### Subscriptions Tab
Manage user subscriptions:
- **View Subscriptions**: All active, pending, cancelled, and expired subscriptions
- **Filter**: By status and plan type
- **Actions**:
  - Approve/Reject pending subscriptions
  - Cancel active subscriptions
  - Edit subscription details
  - Update billing information
- **Export**: Export subscription data

### Plan Management Tab
Create and manage subscription plans that users will see:
- **Create Plans**: Add new subscription tiers
- **Edit Plans**: Modify existing plans
  - Change pricing
  - Update features
  - Set billing period (monthly/yearly/lifetime)
  - Configure limits (projects, storage, AI credits)
  - Toggle custom domain and code export
  - Mark as "Popular"
- **Activate/Deactivate**: Control plan visibility to users
- **Delete Plans**: Remove plans (with user migration warning)

## How Plan Management Works

When you create or edit a plan in the Admin Dashboard:
1. Changes are saved to the browser's localStorage
2. The user-facing Plans modal automatically updates
3. Users will see the updated plans immediately when they open the pricing page

### Plan Fields Explained

- **Plan Name**: Display name (e.g., "Pro", "Enterprise")
- **Price**: Cost in USD
- **Billing Period**: monthly, yearly, or lifetime
- **Description**: Short description shown to users
- **Max Projects**: Number of allowed projects (-1 = unlimited)
- **Max Storage**: Storage limit (e.g., "10GB")
- **AI Credits**: Monthly AI generation credits (-1 = unlimited)
- **Support**: Support level (e.g., "Priority", "24/7")
- **Custom Domain**: Toggle whether plan includes custom domain
- **Export Code**: Toggle whether plan allows code export
- **Popular Badge**: Show "Most Popular" badge on this plan
- **Features**: List of features with included/excluded toggle

## Security Notes

⚠️ **Important**: This is a frontend demo implementation
- In production, implement proper authentication with Supabase Auth
- Use Row Level Security (RLS) for database access
- Implement proper admin role-based access control
- Store sensitive data securely on the backend
- Never expose admin credentials in the frontend

## Integration with Supabase (Recommended)

For production deployment:

1. **User Management**
   - Store users in `users` table
   - Sync with Supabase Auth
   - Implement RLS policies

2. **Subscription Management**
   - Create `subscriptions` table
   - Link to payment provider (Stripe, etc.)
   - Track subscription status

3. **Plan Management**
   - Create `plans` table
   - Store all plan configurations
   - Use real-time subscriptions for instant updates

4. **Admin Authentication**
   - Use Supabase Auth with custom claims
   - Implement admin role checks
   - Secure all admin endpoints

## Support

For technical support or questions about the admin dashboard, refer to the main documentation or contact your system administrator.
