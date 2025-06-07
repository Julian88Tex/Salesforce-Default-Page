# Salesforce Default Page Extension

A Chrome extension that automatically redirects you to your preferred page when first logging into Salesforce Lightning Experience.

## 🚀 Quick Start

### Installation
1. **Download the extension files** to a folder on your computer
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable "Developer mode"** (toggle in the top-right corner)
4. **Click "Load unpacked"** and select the folder containing the extension files
5. The extension icon should appear in your Chrome toolbar

### Testing the Extension
1. **Click the extension icon** in your Chrome toolbar to open settings
2. **Choose your default page** from the dropdown (e.g., "Deployment Status")
3. **Log out of Salesforce** completely (or use an incognito window)
4. **Log back into any Salesforce org**
5. **You should be redirected** to your chosen default page instead of the home page

## ⚙️ Features

### 🎯 Smart Redirect Logic
- Only redirects **after initial login** (not on page refreshes or navigation)
- Works with **Salesforce CLI**, **login pages**, and **direct org access**
- Detects **intermediate redirect pages** (like contentDoor)
- **Per-org session tracking** prevents multiple redirects

### 🏠 Default Page Options
- **Deployment Status** - Monitor deployments and changes
- **User Management** - Manage users and permissions
- **Enhanced Profiles** - Configure user profiles
- **Permission Sets** - Manage permission sets
- **Flows** - View and manage Flow automation
- **Apex Classes** - Access Apex code
- **Object Manager** - Configure custom objects
- **Home Page** - Standard Salesforce home
- **Custom Page** - Enter any Lightning URL path

### 🎨 Modern UI
- **Lightning Design System** styling
- **Light/Dark mode** toggle
- **Clean, professional** interface
- **Salesforce-inspired** design

## 📁 Extension Files

Make sure you have all these files in your extension folder:

```
salesforce-default-page/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup interface  
├── popup.js               # Popup functionality
├── content.js             # Main redirect logic
├── icon16.png             # 16x16 extension icon
├── icon32.png             # 32x32 extension icon
├── icon48.png             # 48x48 extension icon
├── icon128.png            # 128x128 extension icon
└── README.md              # This file
```

### Creating Icon Files
Chrome extensions need PNG icons. You can:
1. **Convert the SVG**: Use an online converter to create PNG versions of `icon.svg` at 16px, 32px, 48px, and 128px
2. **Use any house icons**: Download house-shaped PNG icons and rename them appropriately
3. **Quick fix**: Use any 4 PNG files temporarily - the extension will work regardless

See the "Icon Creation Instructions" file for detailed steps.

## 🔧 Configuration

### Setting a Default Page
1. **Click the extension icon** to open settings
2. **Select from dropdown** or choose "Custom Page..."
3. **For custom pages**, either:
   - **Use "Use Current Page" button** - Navigate to your desired page first, then click this button to auto-populate the path
   - **Manually enter** the full Lightning path like `/lightning/setup/CustomMetadata/home`

### Dark Mode
Toggle the **"Dark Mode"** switch for a dark interface theme.

### Enable/Disable
Use the **"Active"** toggle to turn the extension on or off.

## 🐛 Troubleshooting

### Extension Not Working?
1. **Check the console** - Open DevTools (F12) and look for extension logs
2. **Verify you're on Lightning** - Extension only works with Lightning Experience
3. **Clear browser session** - Log out completely and try again
4. **Check permissions** - Make sure the extension has access to Salesforce domains

### Not Redirecting?
The extension only redirects when:
- ✅ Coming from a **login page** or **external source**
- ✅ Landing on **initial pages** (home, setup, one.app)
- ✅ Using **Lightning Experience** (not Classic)
- ✅ **First time** in the browser session for that org

### Custom Page Not Working?
- Use **full Lightning paths** starting with `/lightning/`
- Check the **exact URL** in Salesforce by navigating manually first
- Some pages may require **specific permissions**

## 🔍 Advanced Usage

### Multiple Orgs
The extension works independently for each Salesforce org. You can:
- Set the **same default page** for all orgs
- Extension **remembers per-org** that it has redirected in each browser session

### Salesforce CLI Integration
Perfect for developers using `sf org open`:
```bash
sf org open --target-org my-org
# Will redirect to your chosen default page
```

### Development/Testing
- Use **incognito windows** to test fresh logins
- Check **browser console** for detailed logging
- **Clear session storage** to reset redirect tracking

## 📝 Version History

- **v0.16** - Fixed duplicate ID error and null element issues with proper error checking
- **v0.15** - Fixed custom text box width, improved capture feedback with visual highlighting
- **v0.14** - Removed icons requirement to fix loading error
- **v0.11** - Custom Salesforce-inspired icon, removed upper theme button
- **v0.10** - Lightning Design System UI, improved toggles
- **v0.09** - Enhanced SLDS styling and better UX
- **v0.08** - Simplified icon design, removed test button
- **v0.07** - Added extension logo and theme controls
- **v0.06** - Renamed to "Salesforce Default Page"
- **v0.05** - Added light/dark theme and custom page picker
- **v0.04** - Fixed contentDoor intermediate redirect detection
- **v0.03** - Enhanced login detection and debugging
- **v0.02** - Added configurable default pages
- **v0.01** - Initial deployment status redirector

## 💡 Tips

- **Test in incognito** to simulate fresh logins
- **Use specific pages** like setup areas for faster access
- **Enable dark mode** if you prefer the darker Salesforce theme
- **Check console logs** if redirects aren't working as expected

---

**Need help?** Check the browser console (F12) for detailed logs about what the extension is doing.