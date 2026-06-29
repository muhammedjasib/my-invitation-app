# 🎉 InviteLux - Premium Invitation Generator

Create beautiful, personalized digital invitations in seconds! Share elegant invitation cards with your guests via a unique link.

## ✨ Features

- **Multiple Templates**: Choose from Elegant, Modern, Vintage, and Colorful designs
- **Event Categories**: Support for Weddings, Birthdays, Anniversaries, Baby Showers, House Warmings, Galas, Graduations, and Concerts
- **Color Themes**: Gold & Cream, Navy Blue, Rose Gold, Emerald Green, Purple Elegance
- **Easy Sharing**: Share via WhatsApp, Email, or SMS with one click
- **Mobile Responsive**: Perfect display on all devices
- **RSVP Ready**: Built-in confirmation button for guest responses
- **Fast & Simple**: Create invitations in minutes, not hours

## 🚀 Getting Started

### For Users
1. Visit the website
2. Select a template and event category
3. Fill in your event details (title, date, venue, message)
4. Choose your color theme
5. Click "Generate Invitation Link"
6. Share the link with your guests!

### For Developers
1. Clone the repository:
   ```bash
   git clone https://github.com/muhammedjasib/my-invitation-app.git
   cd my-invitation-app
   ```

2. Open `index.html` in your browser or deploy to GitHub Pages

## 📁 Project Structure

```
my-invitation-app/
├── index.html          # Main invitation generator page
├── invitation.html     # Shareable invitation card page
├── style.css          # All styling for both pages
├── script.js          # JavaScript for generator functionality
└── README.md          # This file
```

## 🎨 How It Works

### 1. Generator Page (index.html)
- Users fill out event details in a form
- Select template, category, and color theme
- JavaScript generates a URL with parameters

### 2. Invitation Page (invitation.html)
- Extracts URL parameters dynamically
- Displays an elegant sealed envelope
- Guest taps to open and see full invitation
- background music support
- Customizable RSVP button

### 3. Sharing
- Share link via WhatsApp, Email, or SMS
- Recipients see a beautiful invitation card
- Mobile-optimized experience

## 🛠️ Technical Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients and animations
- **Vanilla JavaScript**: No dependencies needed
- **Google Fonts**: Poppins & Playfair Display fonts
- **GitHub Pages**: Free hosting

## 💡 Customization

### Add a New Template
Edit the template selection in `index.html` and add corresponding styles in `style.css`.

### Add a New Color Theme
In `invitation.html`, add a new color scheme to the `themes` object:
```javascript
const themes = {
    yourColor: { primary: "#XXXXXX", accent: "#XXXXXX" }
};
```

### Add a New Event Category
Edit the category grid in `index.html`:
```html
<div class="category-card" data-category="Your Event">🎯 Your Event</div>
```

## 📱 Responsive Design

- **Desktop**: Full-width experience with optimal spacing
- **Tablet**: Responsive grid layouts
- **Mobile**: Touch-friendly buttons and readable text

## 🔒 Privacy

- No data is stored on any server
- All information stays in the URL (be mindful of sensitive details)
- No tracking or analytics

## 🚀 Deployment

### GitHub Pages
1. Push to your GitHub repository
2. Go to Settings → Pages
3. Select "Deploy from a branch"
4. Choose `main` branch
5. Your site will be live at: `https://yourusername.github.io/my-invitation-app`

### Other Platforms
Works with any static hosting (Netlify, Vercel, etc.)

## 🐛 Troubleshooting

### Background music not playing?
- Ensure the music file URL is correct
- Some browsers require user interaction before playing audio
- File size shouldn't exceed browser limits

### Special characters not displaying?
- The app uses URL encoding/decoding
- Most special characters are supported

### Link too long?
- Very long messages may create very long URLs
- Keep messages concise for better sharing

## 📝 Future Enhancements

- [ ] Guest RSVP tracking with backend
- [ ] PDF download option
- [ ] Email invitation delivery
- [ ] More template designs
- [ ] Guest list management
- [ ] Multiple language support
- [ ] Custom branding options

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created by **Muhammed Jasib**

## 💬 Support

For issues, suggestions, or feature requests, please open an issue on GitHub.

---

**Happy Inviting! 🎊**
