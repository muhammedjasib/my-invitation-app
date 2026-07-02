# AI Wedding Invitation Builder

A complete production-ready AI-powered Wedding Invitation Builder web application with a premium admin dashboard.

## Features

✨ **Core Features**
- 🔐 Secure Admin Authentication
- 📊 Premium Admin Dashboard
- 🎨 AI-Powered Invitation Creation
- 🔗 Unique Share Links & QR Codes
- 💍 Luxury Premium Invitation Websites
- 📱 Fully Responsive Design
- 🎬 Rich Animations (AOS, GSAP)
- 📸 Advanced Gallery with Lightbox
- 🗺️ Google Maps Integration
- 💬 RSVP Management
- 🎁 Guest Wishes Wall
- 📈 Real-time Analytics
- 🤖 AI Features (Quote, Story, SEO Generation)
- 🎨 Multiple Premium Themes
- ⚡ PWA & Offline Support

## Tech Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- AOS (Animate On Scroll)
- GSAP (GreenSock Animation Platform)
- QRCode.js

### Backend
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Hosting

### APIs
- OpenAI API (for AI features)
- Google Maps API
- Google Analytics

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/muhammedjasib/my-invitation-app.git
   cd my-invitation-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Firebase**
   - Create a Firebase project at https://console.firebase.google.com
   - Copy Firebase config to `config/firebase-config.js`
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Setup Storage buckets

4. **Run locally**
   ```bash
   firebase serve
   ```

5. **Deploy to Firebase Hosting**
   ```bash
   firebase deploy
   ```

## Project Structure

```
my-invitation-app/
├── admin/                    # Admin panel pages
│   ├── dashboard.html
│   ├── create-invitation.html
│   ├── invitations.html
│   ├── rsvp.html
│   ├── wishes.html
│   └── settings.html
├── invitation/              # Guest invitation pages
│   └── [code].html
├── assets/                  # Static resources
│   ├── css/
│   ├── js/
│   ├── components/
│   ├── firebase/
│   └── images/
├── public/                  # PWA assets
│   ├── manifest.json
│   ├── service-worker.js
│   └── robots.txt
├── config/                  # Configuration files
├── docs/                    # Documentation
├── index.html              # Login page
├── package.json
└── firebase.json
```

## Admin Credentials

Default credentials (change after first login):
- Email: admin@wedding.app
- Password: Wedding@Admin123

## Database Schema

### Collections

**users** - Admin user accounts
```
- uid
- email
- displayName
- createdAt
- subscription
```

**invitations** - Wedding invitations
```
- id
- code (10-char unique code)
- userId
- clientName
- brideName
- groomName
- weddingDate
- venue
- theme
- status
- analytics
```

**rsvp** - Guest responses
```
- id
- invitationId
- name
- phone
- guestCount
- attending
- mealPreference
- message
```

**wishes** - Guest wishes/messages
```
- id
- invitationId
- name
- message
- approved
```

**analytics** - Event tracking
```
- id
- invitationId
- event
- device
- country
- timestamp
```

## Features in Detail

### Admin Dashboard
- Real-time invitation statistics
- RSVP tracking and analytics
- Guest management
- Wish moderation
- Quick action buttons

### Create Invitation Form
- Bride & Groom details
- Wedding date & venue
- Photo uploads (gallery, cover image)
- Theme selection
- AI-powered suggestions
- SEO optimization
- RSVP & guest settings

### Guest Invitation Page
- Luxury premium design
- Wedding countdown timer
- Photo gallery with lightbox
- Love story timeline
- Event schedule
- Family members display
- RSVP form
- Guest wishes wall
- Google Maps
- Music player
- Animated elements

### AI Features
- Wedding quote generator
- Love story creator
- Event schedule generator
- SEO description generator
- Color palette suggester
- Invitation description generator

## Security Features

- Firebase Authentication
- Firestore Security Rules
- Input validation & sanitization
- XSS protection
- CSRF protection
- Rate limiting
- Secure file uploads

## Performance Optimizations

- Lazy loading
- Image optimization
- Service Worker caching
- PWA support
- Minified assets
- CDN delivery

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Documentation

- [Firebase Setup Guide](docs/FIREBASE-SETUP.md)
- [API Integration Guide](docs/API-SETUP.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [User Guide](docs/USER-GUIDE.md)

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: https://github.com/muhammedjasib/my-invitation-app/issues
- Email: support@wedding-app.com

---

**Made with ❤️ for beautiful weddings**
