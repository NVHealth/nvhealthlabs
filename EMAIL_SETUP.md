# ===================================
# EMAIL SETUP INSTRUCTIONS
# ===================================

To send real emails, you need to configure email credentials:

## OPTION 1: Gmail SMTP (Easiest for development)

1. Go to https://myaccount.google.com/
2. Security → 2-Step Verification (enable if not already)
3. Security → App passwords
4. Generate a new app password for "Mail"
5. Copy the 16-character password
6. Create .env.local file with:

```
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcd-efgh-ijkl-mnop
```

## OPTION 2: Custom SMTP Provider

For production or other providers (SendGrid, Mailgun, etc.):

```
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
```

## After Setup

1. Restart your development server
2. Try sending an OTP email
3. Check the console for success messages
4. The recipient should receive a real email

## Troubleshooting

- Make sure 2FA is enabled on Gmail
- Use App Password, not your regular Gmail password  
- Check spam folder for emails
- Verify credentials are correct in .env.local
