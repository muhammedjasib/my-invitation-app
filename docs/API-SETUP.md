# API Setup Guide

## OpenAI API Setup

### Step 1: Create OpenAI Account

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Click **Sign up** or **Log in**
3. Complete email verification
4. Accept terms and conditions

### Step 2: Get API Key

1. Go to [API Keys](https://platform.openai.com/account/api-keys)
2. Click **Create new secret key**
3. Copy the key (you won't see it again!)
4. Store safely in your `.env.local` file

### Step 3: Set Up Billing

1. Go to [Billing Settings](https://platform.openai.com/account/billing/overview)
2. Add a payment method
3. Set usage limits to control costs
4. Monitor your usage regularly

### Step 4: Configure in Application

**Option A: Environment Variables (Recommended)**

Create `.env.local` in project root:

```env
VITE_OPENAI_API_KEY=sk-your_api_key_here
```

**Option B: Firebase Configuration**

1. Go to Firebase Console
2. Project Settings → Environment
3. Add custom variable: `OPENAI_API_KEY`
4. Set value to your API key

### Step 5: Test Connection

Run this in browser console after login:

```javascript
AIService.generateWeddingQuote("John", "Jane").then(quote => {
    console.log('Quote:', quote);
}).catch(error => {
    console.error('Error:', error);
});
```

## Google Maps API Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project: `Wedding Invitation Builder`
3. Wait for project to be created

### Step 2: Enable Maps API

1. Go to **APIs & Services** → **Library**
2. Search for **Maps JavaScript API**
3. Click **Enable**
4. Search for **Geocoding API**
5. Click **Enable**

### Step 3: Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. Copy the key
4. Click **Edit** and restrict key:
   - Application restrictions: HTTP referrers (websites)
   - Add your domain: `*.yourdomain.com`
   - API restrictions: Select Maps APIs only

### Step 4: Configure Application

Add to `.env.local`:

```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

Add to your HTML pages:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&libraries=places"></script>
```

## Google Analytics Setup

### Step 1: Enable in Firebase

1. Firebase Console → Project Settings
2. Enable **Google Analytics**
3. Create or select Analytics account
4. Accept terms and enable

### Step 2: Tracking Setup

Google Analytics ID is automatically configured in Firebase initialization.

### Step 3: View Analytics

1. Go to [Google Analytics](https://analytics.google.com)
2. Select your property
3. Monitor real-time data and reports

## SMTP Email Setup (Optional)

For sending emails via Cloud Functions:

### Step 1: Create Service Account

1. Firebase Console → Project Settings → Service Accounts
2. Click **Generate new private key**
3. Save JSON file securely

### Step 2: Configure Email Service

Add to `.env.local`:

```env
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=587
VITE_SMTP_USER=your_email@gmail.com
VITE_SMTP_PASSWORD=your_app_password
VITE_SMTP_FROM=noreply@yourdomain.com
```

## API Rate Limits

### OpenAI
- Free tier: Limited requests
- Paid tier: Depends on plan
- Monitor usage: https://platform.openai.com/account/usage

### Google APIs
- Maps: 25,000 requests/day (free)
- Geocoding: 5,000 requests/day (free)
- Set quotas in Cloud Console

## Cost Estimation

### OpenAI
- GPT-3.5 Turbo: ~$0.0005 per 1K tokens
- Estimate: 100 invitations = ~$0.50

### Google Maps
- Free tier: Up to 25,000 requests/day
- After free tier: $0.005 per request

### Firebase
- Free tier: Generous limits
- Paid tier: Pay-as-you-go

## Troubleshooting

### OpenAI API Errors

**401 Unauthorized**
- Check API key is correct
- Verify API key hasn't expired
- Ensure API key has sufficient permissions

**429 Too Many Requests**
- You've hit rate limit
- Implement request queuing
- Wait before retrying

### Google Maps Errors

**Google Maps API error: InvalidKeyMapError**
- Verify API key is correct
- Check domain restrictions match
- Ensure Maps JavaScript API is enabled

**RequestDeniedMapError**
- Billing not set up
- Verify key restrictions
- Check quota limits

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive data
3. **Restrict API keys** with appropriate permissions
4. **Rotate keys regularly** (every 3-6 months)
5. **Monitor usage** for suspicious activity
6. **Set spending limits** to prevent unexpected charges
7. **Use backend proxies** for API calls in production

## Next Steps

1. [Firebase Setup](./FIREBASE-SETUP.md) - Complete Firebase configuration
2. [Deployment Guide](./DEPLOYMENT.md) - Deploy to production
3. [User Guide](./USER-GUIDE.md) - Start using the application

## Support

- [OpenAI Documentation](https://platform.openai.com/docs)
- [Google Maps Documentation](https://developers.google.com/maps)
- [Google Analytics Documentation](https://support.google.com/analytics)
