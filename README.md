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

## Project Structure

```
my-invitation-app/
├── admin/
│   ├── login.html
│   ├── dashboard.html
│   ├── create-invitation.html
│   ├── invitations.html
│   ├── rsvp.html
│   ├── wishes.html
│   └── settings.html
├── invitation/
│   ├── index.html
│   └── [code].html (dynamic)
├── assets/
│   ├── css/
│   │   ├── admin.css
│   │   ├── invitation.css
│   │   ├── themes.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── main.js
│   │   ├── admin.js
│   │   ├── invitation.js
│   │   ├── ai-service.js
│   │   ├── storage.js
│   │   └── analytics.js
│   ├── components/
│   │   ├── navbar.js
│   │   ├── sidebar.js
│   │   ├── footer.js
│   │   └── forms.js
│   ├── firebase/
│   │   ├── config.js
│   │   ├── auth.js
│   │   ├── firestore.js
│   │   └── storage.js
│   ├── images/
│   │   ├── logos/
│   │   ├── themes/
│   │   └── icons/
├── public/
│   ├── manifest.json
│   ├── service-worker.js
│   └── robots.txt
├── config/
│   ├── firebase-config.example.js
│   ├── firestore-rules.txt
│   └── storage-rules.txt
├── docs/
│   ├── DEPLOYMENT.md
│   ├── FIREBASE-SETUP.md
│   ├── API-SETUP.md
│   └── USER-GUIDE.md
├── index.html
├── package.json
└── firebase.json
```

## Installation

### 1. Clone Repository
```bash
git clone https://github.com/muhammedjasib/my-invitation-app.git
cd my-invitation-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Firebase

1. Create a Firebase project at https://console.firebase.google.com
2. Copy your Firebase config
3. Create `config/firebase-config.js` from the example
4. Enable Authentication (Email/Password)
5. Create Firestore database
6. Setup Storage buckets
7. Deploy Firestore and Storage rules

See [FIREBASE-SETUP.md](docs/FIREBASE-SETUP.md) for detailed instructions.

### 4. Setup OpenAI API

1. Get API key from https://platform.openai.com/api-keys
2. Add to environment variables in Firebase

See [API-SETUP.md](docs/API-SETUP.md) for detailed instructions.

### 5. Run Locally
```bash
firebase serve
```

## Deployment

### Firebase Hosting
```bash
firebase deploy
```

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for complete deployment guide.

## Database Schema

### Collections

**users**
```
- uid (string)
- email (string)
- displayName (string)
- createdAt (timestamp)
- subscription (string)
```

**invitations**
```
- id (string - auto-generated)
- code (string - 10 char unique code)
- userId (string)
- clientName (string)
- brideName (string)
- groomName (string)
- weddingDate (timestamp)
- venue (object)
- theme (object)
- status (string)
- viewCount (number)
- uniqueVisitors (number)
- rsvpCount (number)
- wishesCount (number)
- createdAt (timestamp)
- updatedAt (timestamp)
```

**rsvp**
```
- id (string)
- invitationId (string)
- name (string)
- phone (string)
- guestCount (number)
- attending (boolean)
- mealPreference (string)
- message (string)
- createdAt (timestamp)
```

**wishes**
```
- id (string)
- invitationId (string)
- name (string)
- message (string)
- approved (boolean)
- createdAt (timestamp)
```

**analytics**
```
- id (string)
- invitationId (string)
- event (string)
- device (string)
- country (string)
- timestamp (timestamp)
```

## Environment Variables

Create `.env.local`:

```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_OPENAI_API_KEY=your_openai_key
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
VITE_GOOGLE_ANALYTICS_ID=your_analytics_id
```

## Admin Credentials

Default admin credentials (change after first login):
- Email: admin@wedding.app
- Password: Wedding@Admin123

## Features Detail

### Admin Dashboard
- 📊 Real-time statistics cards
- 📈 RSVP and invitations charts
- 🎯 Quick action buttons
- 📋 Invitation management table
- 🔍 Search and filter

### Invitation Creation
- AI-powered form assistance
- Rich media uploads
- Theme selection
- SEO optimization
- Preview before publishing

### Guest Experience
- Luxury premium design
- Wedding countdown timer
- Photo gallery with lightbox
- RSVP form
- Guest wishes wall
- Location map
- Background music
- Animated elements

### AI Features
- Quote generation
- Love story creation
- SEO optimization
- Color palette suggestion
- Event schedule generation
- Welcome message creation

## Security

- Firebase Authentication
- Firestore Security Rules
- Input validation
- Rate limiting
- XSS protection
- CSRF protection
- Secure API endpoints

## Performance

- Lazy loading
- Image compression
- Service Worker
- PWA support
- Caching strategies
- Minified assets

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

MIT License - See LICENSE file

## Support

For issues and feature requests, visit: https://github.com/muhammedjasib/my-invitation-app/issues

## Contributing

Contributions are welcome! Please read our contributing guidelines.

---

**Made with ❤️ for beautiful weddings**
