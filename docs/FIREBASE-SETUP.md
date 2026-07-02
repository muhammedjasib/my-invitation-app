# Firebase Setup Guide

## Overview

This guide will help you set up Firebase for the Wedding Invitation Builder application.

## Prerequisites

- Google account
- Firebase CLI installed (`npm install -g firebase-tools`)
- Node.js and npm installed

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Create Project**
3. Enter project name: `wedding-invitation-builder`
4. Click **Continue**
5. Disable Google Analytics (optional)
6. Click **Create Project**
7. Wait for project creation to complete

## Step 2: Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **Get Started**
3. Select **Email/Password**
4. Enable **Email/Password** toggle
5. Click **Save**

## Step 3: Create Firestore Database

1. Go to **Build** → **Firestore Database**
2. Click **Create Database**
3. Select your region (closest to your users)
4. Choose **Start in production mode**
5. Click **Enable**

## Step 4: Setup Storage

1. Go to **Build** → **Storage**
2. Click **Get Started**
3. Click **Start in production mode**
4. Click **Next** and **Done**

## Step 5: Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Select **General** tab
3. Scroll to **Your apps** section
4. Click on the Web app icon `</>`
5. Copy the Firebase config object

## Step 6: Configure Project

1. Copy `config/firebase-config.example.js` to `config/firebase-config.js`
2. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id",
    measurementId: "G_YOUR_MEASUREMENT_ID"
};
```

## Step 7: Create Admin User

1. In Firebase Console, go to **Authentication**
2. Click **Create user**
3. Email: `admin@wedding.app`
4. Password: `Wedding@Admin123` (change after first login!)
5. Click **Create**

## Step 8: Setup Firestore Security Rules

1. Go to **Firestore Database**
2. Click **Rules** tab
3. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Users can read/write their own invitations
    match /invitations/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId || request.auth.uid == request.resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }

    // Anyone can read published invitations via code
    match /invitations/{document=**} {
      allow read: if resource.data.status == 'published';
    }

    // Anyone can create RSVP
    match /rsvp/{document=**} {
      allow create: if true;
      allow read, write: if request.auth.uid == get(/databases/$(database)/documents/invitations/$(resource.data.invitationId)).data.userId;
    }

    // Anyone can create wishes
    match /wishes/{document=**} {
      allow create: if true;
      allow read, write: if request.auth.uid == get(/databases/$(database)/documents/invitations/$(resource.data.invitationId)).data.userId;
    }

    // Analytics can be created by anyone
    match /analytics/{document=**} {
      allow create: if true;
      allow read: if request.auth.uid == get(/databases/$(database)/documents/invitations/$(resource.data.invitationId)).data.userId;
    }
  }
}
```

4. Click **Publish**

## Step 9: Setup Storage Security Rules

1. Go to **Storage** → **Rules**
2. Replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow users to read/write files in their own directory
    match /invitations/{userId}/{allPaths=**} {
      allow read, write: if request.auth.uid == userId;
    }

    // Allow music uploads
    match /music/{userId}/{allPaths=**} {
      allow read, write: if request.auth.uid == userId;
    }

    // Public access to certain folders
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid != null;
    }
  }
}
```

3. Click **Publish**

## Step 10: Deploy to Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```

4. When prompted:
   - Select: **Firestore**, **Storage**, **Hosting**
   - Use `firebase.json` file that already exists
   - Set public directory to `public` (or adjust as needed)

5. Deploy:
   ```bash
   firebase deploy
   ```

## Step 11: Enable Firestore Indexes (if needed)

Some queries may require composite indexes:

1. Go to **Firestore Database** → **Indexes**
2. Firebase will suggest indexes when needed
3. Click **Create Index** as suggested

## Environment Variables

For local development, create a `.env.local` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G_your_measurement_id
```

## Troubleshooting

### Authentication Issues
- Ensure Email/Password authentication is enabled
- Check that user email is verified
- Clear browser cache and localStorage

### Firestore Access Denied
- Review security rules
- Check user authentication status
- Verify `userId` matches in rules

### Storage Upload Fails
- Check storage security rules
- Verify file size limits (5MB for images, 20MB for audio)
- Check file permissions in Firebase Console

### Deployment Issues
- Run `firebase use --add` to select correct project
- Check `firebase.json` configuration
- Verify all files are properly built

## Next Steps

1. [API Setup Guide](./API-SETUP.md) - Configure OpenAI API
2. [Deployment Guide](./DEPLOYMENT.md) - Deploy to production
3. [User Guide](./USER-GUIDE.md) - Learn how to use the app

## Support

For Firebase help:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [Stack Overflow Firebase Tag](https://stackoverflow.com/questions/tagged/firebase)
