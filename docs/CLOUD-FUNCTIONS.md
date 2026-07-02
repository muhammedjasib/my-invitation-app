# Firebase Cloud Functions Setup

## Overview

Cloud Functions handle server-side logic like email sending, data validation, and security operations.

## Setup

### 1. Initialize Cloud Functions

```bash
firebase init functions
cd functions
npm install
```

### 2. Create Email Function

**functions/index.js**

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure your email service
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

// Send email on RSVP creation
exports.sendRSVPConfirmation = functions.firestore
    .document('rsvp/{rsvpId}')
    .onCreate(async (snap, context) => {
        const rsvpData = snap.data();
        
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: rsvpData.email,
            subject: 'RSVP Confirmation',
            html: `
                <h2>Thank you for your RSVP!</h2>
                <p>Hello ${rsvpData.name},</p>
                <p>We received your response. Looking forward to celebrating with you!</p>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    });

// Send welcome email on user creation
exports.sendWelcomeEmail = functions.auth
    .user()
    .onCreate(async (user) => {
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: user.email,
            subject: 'Welcome to Wedding Invitation Builder',
            html: `
                <h2>Welcome!</h2>
                <p>Hello ${user.displayName || user.email},</p>
                <p>Your account has been created. Login to start creating your invitation!</p>
                <a href="${process.env.APP_URL}/admin/dashboard.html">Go to Dashboard</a>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Welcome email sent');
        } catch (error) {
            console.error('Error sending welcome email:', error);
        }
    });

// Validate RSVP data
exports.validateRSVP = functions.firestore
    .document('rsvp/{rsvpId}')
    .onCreate(async (snap, context) => {
        const rsvpData = snap.data();
        const errors = [];

        if (!rsvpData.name || rsvpData.name.trim().length === 0) {
            errors.push('Name is required');
        }

        if (!rsvpData.guestCount || rsvpData.guestCount < 1) {
            errors.push('Guest count must be at least 1');
        }

        if (rsvpData.message && rsvpData.message.length > 500) {
            errors.push('Message cannot exceed 500 characters');
        }

        if (errors.length > 0) {
            throw new Error(`RSVP validation failed: ${errors.join(', ')}`);
        }
    });

// Send invitation reminder (scheduled)
exports.sendRSVPReminders = functions.pubsub
    .schedule('every 7 days')
    .onRun(async (context) => {
        // Get invitations created more than 14 days ago without full RSVPs
        const db = admin.firestore();
        const snapshot = await db.collection('invitations')
            .where('status', '==', 'published')
            .get();

        for (const doc of snapshot.docs) {
            const invitation = doc.data();
            // Send reminder logic here
            console.log(`Sending reminder for invitation: ${invitation.code}`);
        }
    });
```

### 3. Set Environment Variables

```bash
firebase functions:config:set smtp.host="smtp.gmail.com" \
  smtp.port="587" \
  smtp.user="your_email@gmail.com" \
  smtp.password="your_app_password"
```

### 4. Deploy Functions

```bash
firebase deploy --only functions
```

## Email Configuration

### Using Gmail with App Password

1. Enable 2FA on your Google account
2. Generate App Password at https://myaccount.google.com/apppasswords
3. Use the 16-character password in Cloud Functions

### Using SendGrid

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

### Using AWS SES

```javascript
const AWS = require('aws-sdk');
const ses = new AWS.SES({region: 'us-east-1'});
```

## Email Templates

Store templates in Firestore:

```javascript
const emailTemplates = {
    welcome: {
        subject: 'Welcome to Wedding Invitation Builder',
        template: 'welcome.html'
    },
    rsvpConfirmation: {
        subject: 'RSVP Confirmation',
        template: 'rsvp-confirmation.html'
    },
    reminder: {
        subject: 'RSVP Reminder',
        template: 'rsvp-reminder.html'
    }
};
```

## Testing

```bash
# Test locally
firebase emulators:start --only functions

# Run specific function
firebase functions:call sendRSVPConfirmation
```

## Monitoring

View logs in Firebase Console:
- Go to **Functions** → **Logs**
- Check execution times and errors
- Monitor quotas and usage

## Cost Optimization

- **Free tier:** 125,000 invocations/month
- **Paid tier:** $0.40 per million invocations
- Use Pub/Sub for scheduled tasks
- Cache frequently used data

## Troubleshooting

### Email not sending
- Verify SMTP credentials
- Check email address format
- Review Cloud Functions logs
- Test with Gmail's App Password

### Rate limiting
- Implement exponential backoff
- Use Cloud Tasks for queuing
- Set rate limits per user

### Timeout errors
- Increase function timeout (max 540 seconds)
- Optimize database queries
- Use caching

## Security

- Store credentials in Cloud Functions config
- Use environment variables
- Never commit credentials
- Validate all input data
- Sanitize email content
- Use HTTPS for external calls

## Documentation

- [Firebase Cloud Functions](https://firebase.google.com/docs/functions)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Firebase Emulator](https://firebase.google.com/docs/emulator-suite)
