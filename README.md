# 🏠 Salesforce Default Page Extension

Skip the Salesforce home page and automatically redirect to your preferred Salesforce page after login.

## ✨ Features

- **Auto-redirect after login**: Go straight to Deployment Status, User Management, or any page of your choice
- **Active toggle**: Easily enable or disable the redirect feature
- **Light/Dark mode**: Switch between light and dark extension themes
- **Custom page capture**: Click "Use Current Page" to set any Lightning page as your default
- **Smart detection**: Only redirects after a fresh login (not on page refreshes or navigation)
- **Works everywhere**: Supports Salesforce CLI (`sf org open`), all org types, sandbox and production

## 🚀 Installation

There are two ways to install this extension.

### Option 1: For Most Users (Easy)
1. Go to the **[Releases page](https://github.com/Julian88Tex/Salesforce-Default-Page/releases)**.
2. Under the latest release, download the `Source code (zip)` file.
3. Unzip the file. You will have a folder named something like `Salesforce-Default-Page-0.41`.

### Option 2: For Developers (Using Git)
Clone this repository to your local machine:
```sh
git clone https://github.com/Julian88Tex/Salesforce-Default-Page.git
```
This will create a `Salesforce-Default-Page` folder with the latest code.

### Loading the Extension in Chrome
Once you have the extension folder, follow these steps:
1. **Open Chrome** and navigate to `chrome://extensions/`.
2. **Turn on "Developer mode"** in the top-right corner.
3. Click **"Load unpacked"**.
4. **Select the extension folder** (e.g., `Salesforce-Default-Page`).
5. The extension will now be active and appear in your Chrome toolbar.

## 🧪 How to Use

1. **Click the extension icon** in the Chrome toolbar
2. **Choose your default page** from the dropdown, or select "Custom Page..." and use "Use Current Page" to capture the current Lightning page
3. **Toggle "Active"** to enable or disable the redirect feature
4. **(Optional) Toggle "Dark Mode"** for a dark theme
5. **Log out of Salesforce** completely
6. **Log back in** → You should be redirected to your chosen default page after login
7. **Test with Salesforce CLI**: Run `sf org open -o <org-name>` and confirm the redirect works after CLI login

## 🛠️ Reporting Issues

- Click the **Report Issues** link in the extension popup or go directly to the **[Issues page](https://github.com/Julian88Tex/Salesforce-Default-Page/issues)**.
- Please check for existing issues and provide as much detail as possible, including your browser/OS version and steps to reproduce.

## 💡 Testing Tips

- **Test in incognito** for a fresh login simulation
- **Try with `sf org open`** from Salesforce CLI
- **Custom pages**: Navigate to any Lightning page, click "Use Current Page" to set as default
- **Check the console** (F12) if issues occur