# 🏠 Salesforce Default Page Extension

Skip the Salesforce home page and automatically redirect to your preferred Salesforce page after login.

## ✨ Features

- **Auto-redirect after login**: Go straight to Deployment Status, User Management, or any page of your choice
- **Active toggle**: Easily enable or disable the redirect feature
- **Light/Dark mode**: Switch between light and dark extension themes
- **Custom page capture**: Click "Use Current Page" to set any Lightning page as your default
- **Smart detection**: Only redirects after a fresh login (not on page refreshes or navigation)
- **Works everywhere**: Supports Salesforce CLI (`sf org open`), all org types, sandbox and production

## 🚀 Quick Setup

1. **Download files** to a folder called `salesforce-default-page`
2. **Open Chrome** → `chrome://extensions/`
3. **Turn on "Developer mode"** → Click "Load unpacked"
4. **Select your folder** → Extension appears in the toolbar

## 🧪 How to Use

1. **Click the extension icon** in the Chrome toolbar
2. **Choose your default page** from the dropdown, or select "Custom Page..." and use "Use Current Page" to capture the current Lightning page
3. **Toggle "Active"** to enable or disable the redirect feature
4. **(Optional) Toggle "Dark Mode"** for a dark theme
5. **Log out of Salesforce** completely
6. **Log back in** → You should be redirected to your chosen default page after login
7. **Test with Salesforce CLI**: Run `sf org open -o <org-name>` and confirm the redirect works after CLI login

## 🛠️ Reporting Issues

- Click the **Report Issues**
  [https://github.com/Julian88Tex/Salesforce-Default-Page/issues](https://github.com/Julian88Tex/Salesforce-Default-Page/issues)
- Please include your Chrome version, OS, and a description of the issue.

## 💡 Testing Tips

- **Test in incognito** for a fresh login simulation
- **Try with `sf org open`** from Salesforce CLI
- **Custom pages**: Navigate to any Lightning page, click "Use Current Page" to set as default
- **Check the console** (F12) if issues occur