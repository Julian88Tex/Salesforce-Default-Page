# 🏠 Salesforce Default Page Extension

Skip the Salesforce home page - automatically redirect to your preferred Lightning page after login.

## ✨ Features

- **Auto-redirect after login** - Go straight to Deployment Status, User Management, or any Lightning page
- **Smart detection** - Only redirects after fresh login, not on page refreshes
- **Custom page capture** - Click "Capture" to grab any Lightning page URL
- **Works everywhere** - Salesforce CLI, all org types, sandbox and production

## 🚀 Quick Setup

1. **Download files** to a folder called `salesforce-default-page`
2. **Open Chrome** → `chrome://extensions/`
3. **Turn on "Developer mode"** → Click "Load unpacked"
4. **Select your folder** → Extension appears in toolbar

## 🧪 Test It

1. **Click extension icon** → Choose "Deployment Status"
2. **Log out of Salesforce** completely 
3. **Log back in** → Should redirect to deployment page instead of home

## 📁 Required Files

```
salesforce-default-page/
├── manifest.json
├── popup.html
├── popup.js
└── content.js
```

## 💡 Tips

- **Test in incognito** for fresh login simulation
- **Works with `sf org open`** from Salesforce CLI
- **Custom pages** - Navigate to any page, click "Capture" to set as default
- **Check console** (F12) if issues occur

Perfect for admins who always need deployment status or developers using scratch orgs! 🎯