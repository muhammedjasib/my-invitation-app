# Deployment Guide

## Deployment Options

### Option 1: Firebase Hosting (Recommended)

Firebase Hosting provides:
- Global CDN
- SSL/TLS encryption
- Fast deployment
- Free tier available
- Custom domain support

#### Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project created
- Authenticated: `firebase login`

#### Deployment Steps

1. **Prepare for deployment:**
   ```bash
   npm run build
   ```

2. **Initialize Firebase (if not done):**
   ```bash
   firebase init hosting
   ```

3. **Deploy:**
   ```bash
   firebase deploy
   ```

4. **Verify deployment:**
   - Check Firebase Console for deployment status
   - Visit your hosting URL
   - Run tests to verify functionality

#### Firebase Configuration

Update `firebase.json`:

```json
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/assets/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

### Option 2: GitHub Pages

For frontend-only deployment:

1. **Create `.github/workflows/deploy.yml`:**
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Build
           run: npm run build
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./public
   ```

2. **Push to GitHub:**
   ```bash
   git push origin main
   ```

### Option 3: Custom Server

For maximum control:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Copy files to server:**
   ```bash
   scp -r public/* user@server:/var/www/html/
   ```

3. **Configure web server (Nginx):**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/html;
       
       # Redirect http to https
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name yourdomain.com;
       root /var/www/html;
       
       ssl_certificate /etc/ssl/cert.pem;
       ssl_certificate_key /etc/ssl/key.pem;
       
       # SPA routing
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

## Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Firebase config set up correctly
- [ ] Database security rules deployed
- [ ] Storage rules configured
- [ ] Admin user created
- [ ] API keys configured (OpenAI, Google Maps)
- [ ] HTTPS certificate valid
- [ ] All tests passing
- [ ] Error logging configured
- [ ] Analytics enabled

## Configuration for Production

### Environment Variables

Create `.env.production`:

```env
NODE_ENV=production
VITE_FIREBASE_API_KEY=your_production_key
VITE_FIREBASE_AUTH_DOMAIN=your_production.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_production_id
VITE_FIREBASE_STORAGE_BUCKET=your_production.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_production_sender_id
VITE_FIREBASE_APP_ID=your_production_app_id
VITE_OPENAI_API_KEY=your_production_openai_key
VITE_GOOGLE_MAPS_API_KEY=your_production_maps_key
VITE_GOOGLE_ANALYTICS_ID=G_your_production_id
```

### Security Headers

Add to your web server or Firebase config:

```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://www.gstatic.com; style-src 'self' 'unsafe-inline'
```

### Custom Domain Setup

1. **Firebase Hosting:**
   - Firebase Console → Hosting
   - Click **Add Custom Domain**
   - Follow verification steps
   - Update DNS records

2. **DNS Configuration:**
   ```
   A Record: your-site.firebaseapp.com
   CNAME: www -> your-site.firebaseapp.com
   ```

## Performance Optimization

### Image Optimization

1. Compress images before upload
2. Use WebP format when possible
3. Implement lazy loading
4. Set appropriate alt text

### Code Minification

```bash
npm run build
```

### Caching Strategy

- Static assets: 1 year cache
- HTML files: No cache
- API responses: 5 minute cache

### CDN Configuration

Enable Firebase Hosting CDN:
- Automatically enabled
- Cache assets globally
- Purge cache on deploy

## Monitoring & Logging

### Firebase Console Monitoring

1. **Real-time Database:**
   - Check read/write operations
   - Monitor data size
   - Review security rule denials

2. **Storage:**
   - Monitor upload/download operations
   - Check file sizes
   - Review failed operations

3. **Authentication:**
   - Monitor active users
   - Review sign-in methods
   - Check authentication errors

### Google Analytics

1. Monitor traffic patterns
2. Track user engagement
3. Review conversion rates
4. Analyze user demographics

### Error Tracking

1. Set up error reporting
2. Monitor console errors
3. Track API failures
4. Alert on critical errors

## Rollback Strategy

If issues occur:

```bash
# View deployment history
firebase hosting:channels:list

# Rollback to previous version
firebase hosting:clone <source-site> <target-site>
```

## Scheduled Maintenance

- **Daily:** Check error logs
- **Weekly:** Review analytics
- **Monthly:** Update dependencies
- **Quarterly:** Security audit
- **Annually:** Infrastructure review

## Backup Strategy

1. **Database Backups:**
   - Firebase automatic backups
   - Export data monthly
   - Store backups securely

2. **Code Backups:**
   - GitHub repository
   - Tag releases
   - Keep changelog

## Disaster Recovery

1. **Identify issues:** Monitor logs and alerts
2. **Assess impact:** Determine scope of problem
3. **Execute recovery:** Rollback or fix and redeploy
4. **Communicate:** Notify users if necessary
5. **Post-mortem:** Document and prevent recurrence

## Support

- [Firebase Deployment Docs](https://firebase.google.com/docs/hosting)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Firebase Support](https://firebase.google.com/support)

## Next Steps

1. [Firebase Setup](./FIREBASE-SETUP.md) - Complete Firebase configuration
2. [API Setup](./API-SETUP.md) - Configure external APIs
3. [User Guide](./USER-GUIDE.md) - Learn how to use the application
