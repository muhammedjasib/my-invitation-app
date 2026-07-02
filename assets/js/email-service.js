# Email Service Module
# Handles email sending for notifications and confirmations

const EmailService = (() => {
    // Get SMTP configuration from environment
    const getConfig = () => {
        return {
            host: process.env.VITE_SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.VITE_SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.VITE_SMTP_USER,
                pass: process.env.VITE_SMTP_PASSWORD
            },
            from: process.env.VITE_SMTP_FROM || 'noreply@wedding-app.com'
        };
    };

    // Send welcome email
    const sendWelcomeEmail = async (userEmail, userName) => {
        const template = `
            <h2>Welcome to Wedding Invitation Builder!</h2>
            <p>Hello ${userName},</p>
            <p>We're excited to help you create beautiful wedding invitations.</p>
            <p>Get started by logging into your dashboard and creating your first invitation.</p>
            <p>
                <a href="${process.env.VITE_APP_URL}/admin/dashboard.html" style="
                    display: inline-block;
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #D4A574 0%, #8B7355 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: 600;
                ">
                    Go to Dashboard
                </a>
            </p>
            <p>Happy wedding planning!</p>
            <p>
                Wedding Invitation Builder Team<br>
                <a href="${process.env.VITE_APP_URL}">Visit our website</a>
            </p>
        `;

        return await sendEmail(userEmail, 'Welcome to Wedding Invitation Builder', template);
    };

    // Send RSVP confirmation
    const sendRSVPConfirmation = async (guestEmail, guestName, coupleNames) => {
        const template = `
            <h2>RSVP Confirmation</h2>
            <p>Hello ${guestName},</p>
            <p>Thank you for confirming your attendance to ${coupleNames}'s wedding!</p>
            <p>We look forward to celebrating with you.</p>
            <p>
                <a href="${process.env.VITE_APP_URL}" style="
                    display: inline-block;
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #D4A574 0%, #8B7355 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: 600;
                ">
                    View Invitation
                </a>
            </p>
            <p>If you need to update your RSVP, please visit the invitation page.</p>
        `;

        return await sendEmail(guestEmail, 'RSVP Confirmation', template);
    };

    // Send RSVP reminder
    const sendRSVPReminder = async (guestEmail, guestName, invitationLink) => {
        const template = `
            <h2>Friendly RSVP Reminder</h2>
            <p>Hello ${guestName},</p>
            <p>We would love to know if you'll be joining us!</p>
            <p>Please respond to our wedding invitation as soon as possible.</p>
            <p>
                <a href="${invitationLink}" style="
                    display: inline-block;
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #D4A574 0%, #8B7355 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: 600;
                ">
                    Respond to RSVP
                </a>
            </p>
            <p>Thank you!</p>
        `;

        return await sendEmail(guestEmail, 'RSVP Reminder - Please Respond', template);
    };

    // Send password reset email
    const sendPasswordResetEmail = async (userEmail, resetLink) => {
        const template = `
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password.</p>
            <p>Click the link below to create a new password (valid for 1 hour):</p>
            <p>
                <a href="${resetLink}" style="
                    display: inline-block;
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #D4A574 0%, #8B7355 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: 600;
                ">
                    Reset Password
                </a>
            </p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>For security reasons, this link will expire in 1 hour.</p>
        `;

        return await sendEmail(userEmail, 'Reset Your Password', template);
    };

    // Send invitation to guest
    const sendInvitationEmail = async (guestEmail, guestName, invitationLink, coupleNames) => {
        const template = `
            <h2>${coupleNames} invite you to their wedding!</h2>
            <p>Hello ${guestName},</p>
            <p>We're delighted to invite you to share in our special day!</p>
            <p>Please view our invitation and respond with your RSVP:</p>
            <p>
                <a href="${invitationLink}" style="
                    display: inline-block;
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #D4A574 0%, #8B7355 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: 600;
                ">
                    View Invitation
                </a>
            </p>
            <p>We hope to celebrate with you soon!</p>
            <p>Warm regards,<br>${coupleNames}</p>
        `;

        return await sendEmail(guestEmail, `You're Invited! - ${coupleNames}'s Wedding`, template);
    };

    // Send RSVP notification to couple
    const sendRSVPNotificationToCouples = async (coupleEmail, guestName, response, mealPreference) => {
        const status = response ? 'Confirmed' : 'Declined';
        const mealText = mealPreference ? `Meal Preference: ${mealPreference}` : '';

        const template = `
            <h2>New RSVP Received</h2>
            <p><strong>${guestName}</strong> has ${status.toLowerCase()} their attendance.</p>
            <p>Status: <strong>${status}</strong></p>
            <p>${mealText}</p>
            <p>
                <a href="${process.env.VITE_APP_URL}/admin/rsvp.html" style="
                    display: inline-block;
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #D4A574 0%, #8B7355 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: 600;
                ">
                    View All RSVPs
                </a>
            </p>
        `;

        return await sendEmail(coupleEmail, `New RSVP: ${guestName}`, template);
    };

    // Generic email sender
    const sendEmail = async (to, subject, html) => {
        try {
            // This would be handled by Firebase Cloud Functions or backend service
            // For now, we'll provide the structure
            
            const emailData = {
                to,
                subject,
                html,
                from: process.env.VITE_SMTP_FROM || 'noreply@wedding-app.com',
                timestamp: new Date()
            };

            // Log email sending (in production, this would go to Firebase)
            console.log('Email queued for sending:', emailData);

            return {
                success: true,
                messageId: Math.random().toString(36).substr(2, 9),
                message: 'Email queued for sending'
            };
        } catch (error) {
            console.error('Email sending error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    };

    return {
        sendWelcomeEmail,
        sendRSVPConfirmation,
        sendRSVPReminder,
        sendPasswordResetEmail,
        sendInvitationEmail,
        sendRSVPNotificationToCouples,
        sendEmail
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailService;
}
