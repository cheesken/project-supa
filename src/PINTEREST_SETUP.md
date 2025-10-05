# Pinterest Integration Setup

StyleSync now has **real Pinterest integration** that allows users to connect their Pinterest accounts and import their moodboards!

## What You Need to Do

To enable this feature, you need to set up a Pinterest App and configure the API credentials:

### 1. Create a Pinterest App

1. Go to [Pinterest Developers](https://developers.pinterest.com/)
2. Sign in with your Pinterest account
3. Click "Create app" and fill in the required information:
   - **App name**: StyleSync
   - **App description**: Fashion moodboard and recommendation platform
   - **Website URL**: Your deployed app URL
   - **Redirect URI**: `https://your-app-url.com/pinterest-callback`

### 2. Get Your API Credentials

After creating your app, you'll receive:
- **App ID** (Client ID)
- **App Secret** (Client Secret)

### 3. Configure Environment Variables

You need to add these two environment variables to your Supabase project:

1. Go to your Supabase project settings
2. Navigate to "Edge Functions" → "Secrets"
3. Add these environment variables:
   - `PINTEREST_APP_ID`: Your Pinterest App ID
   - `PINTEREST_APP_SECRET`: Your Pinterest App Secret

## How It Works

### User Flow:

1. **Connect Pinterest**: User clicks "Connect Pinterest" in the Social Media tab
2. **OAuth Flow**: User is redirected to Pinterest to authorize the app
3. **Callback**: Pinterest redirects back to `/pinterest-callback` with an authorization code
4. **Token Exchange**: Backend exchanges the code for an access token
5. **Data Fetch**: User can now view their Pinterest boards and pins in the Moodboard tab

### Features:

- ✅ Real Pinterest OAuth authentication
- ✅ Fetch user's Pinterest boards
- ✅ Browse pins from any board
- ✅ Visual Pinterest-style masonry grid
- ✅ Click through to original pins
- ✅ Secure token storage in backend KV store
- ✅ Disconnect Pinterest option

### API Endpoints Created:

- `GET /pinterest/auth-url` - Generate OAuth URL
- `POST /pinterest/callback` - Handle OAuth callback
- `GET /pinterest/boards/:userId` - Fetch user's boards
- `GET /pinterest/pins/:userId/:boardId` - Fetch pins from a board
- `DELETE /pinterest/disconnect/:userId` - Disconnect Pinterest

## Testing

For testing without real Pinterest credentials, the Instagram and TikTok connections are still mock connections. Only Pinterest is a real integration.

## Important Notes

- The access token is securely stored in the backend KV store
- Users can disconnect Pinterest anytime, which removes their token
- All Pinterest API calls are made from the backend for security
- The frontend only receives public board/pin data

## Redirect URI Configuration

Make sure to add the exact redirect URI to your Pinterest App settings:
- Development: `http://localhost:5173/pinterest-callback`
- Production: `https://your-domain.com/pinterest-callback`

The redirect URI must match exactly, including the protocol (http/https) and path.
